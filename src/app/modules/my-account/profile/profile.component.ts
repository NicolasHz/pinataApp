import { User } from './../../../interfaces/user';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

// Options-Validators
import { ERROR_MESSAGES_RESOURCES, DATE_OF_BIRTH_PICKER_OPTIONS } from '../../../shared/options/date-time-pickers';
import { IsEmptyValidator } from '../../../shared/validators/validators';

// Services
import { UserService } from '../../../services/user/user.service';
import { MzToastService } from 'ngx-materialize';
import { UtilsService } from '../../../services/utils/utils.service';
import { UploadImageService } from '../../../services/upload-image/upload-image.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  public errorMessageResources = ERROR_MESSAGES_RESOURCES;
  public datepickerOptions = DATE_OF_BIRTH_PICKER_OPTIONS;
  public generalForm: FormGroup;
  public user: User;
  public tooltip = '';
  private currentUserImage = '';
  public uploadingImage = false;
  @ViewChild('onBirthdayListChk') onBirthdayList: ElementRef;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private util: UtilsService,
    private uploadImageService: UploadImageService,
    private toastService: MzToastService) { }

  ngOnInit() {
    this.subscriptions.add(this.userService.getUser().subscribe((user: User) => {
      this.user = user;
      this.currentUserImage = this.user.profilePicUrl;
      this.initForms();
    }));
    if (this.user.isNewUser && this.util.diferenceOfTimeFromNow(this.user.lastTimeModified, 'minutes') < 1) {
      this.uploadFirstImage();
    }
    this.tooltip = !this.util.isGlobantUser(this.user) ? 'Sorry this is not an Globant account!' : 'Join the birthday list form';
  }

  ngAfterViewInit() {
    this.onBirthdayList.nativeElement.value = this.user.onBirthdayList;
    this.onBirthdayList.nativeElement.checked = this.user.onBirthdayList;
    this.onBirthdayList.nativeElement.disabled = !this.util.isGlobantUser(this.user);
  }

  initForms() {
    this.buildGeneralForm();
    if (this.user.onBirthdayList) {
      this.buildBirthdayForm();
    }
  }

  buildGeneralForm() {
    this.generalForm = this.formBuilder.group({
      fullName: [this.user.fullName, [Validators.required, IsEmptyValidator]]
    });
  }

  buildBirthdayForm() {
    const userPreferences = [];
    if (this.user.preferences.length > 0) {
      this.user.preferences.map(preference => {
        const newPreferenceGroup = this.formBuilder.group({
          preference: [preference, [Validators.required, IsEmptyValidator, Validators.maxLength(15)]],
        });
        userPreferences.push(newPreferenceGroup);
      });
    }
    this.generalForm.addControl('dateOfBirth', new FormControl(this.user.dateOfBirth, Validators.required));
    this.generalForm.addControl('preferences', this.formBuilder.array(userPreferences));
    if (this.generalForm.value.preferences.length <= 0) {
      this.addPreference();
    }
  }

  addPreference(): void {
    const preferenceControl =  this.generalForm.get('preferences') as FormArray;
    const newPreferenceGroup = this.formBuilder.group({
      preference: ['', [Validators.required, IsEmptyValidator, Validators.maxLength(15)]]
    });
    preferenceControl.push(newPreferenceGroup);
    this.generalForm.markAsTouched();
  }

  getPreferences(): AbstractControl[] {
    return (this.generalForm.get('preferences') as FormArray).controls;
  }

  deletePreference(index: number) {
    const phoneNumbersControl = this.generalForm.get('preferences') as FormArray;
    phoneNumbersControl.removeAt(index);
    this.generalForm.markAsTouched();
  }

  deleteBirthdayList() {
    this.generalForm.removeControl('dateOfBirth');
    this.generalForm.removeControl('preferences');
    this.generalForm.markAsTouched();
  }

  toggleBirthdayList(event) {
    if (event.target.checked) {
      this.buildBirthdayForm();
    } else {
      this.deleteBirthdayList();
    }
    this.user.onBirthdayList = event.target.checked;
    this.generalForm.markAsTouched();
  }

  submitForm() {
    if (!this.user.onBirthdayList) {
      this.user.fullName = this.generalForm.value.fullName;
    } else {
      const updatedPreferences = [];
      this.generalForm.value.preferences.map(preference => {
        updatedPreferences.push(preference.preference);
      });
      this.user = {
        ...this.user,
        fullName: this.generalForm.value.fullName,
        dateOfBirth: this.generalForm.value.dateOfBirth,
        preferences: updatedPreferences
      };
    }
    this.userService.addUser(this.user).then(response => {
      if (response) {
        this.initForms();
        this.showToast('Profile Updated!', 'green');
      } else {
        this.initForms();
        this.showToast('Something went wrong please try again', 'red');
      }
    });
  }

  cancelForm() {
    this.initForms();
    this.user.profilePicUrl = this.currentUserImage;
  }

  uploadFirstImage() {
    this.subscriptions.add(this.uploadImageService.getImage(this.user.profilePicUrl).subscribe(r => {
      const image = this.uploadImageService.digestImage(r);
      this.uploadImageService.uploadImage(image, this.user.uId, this.user.fullName).then(imageUrl => {
        this.user.profilePicUrl = imageUrl;
        this.userService.addUser(this.user);
      });
    }));
  }

  onFileSelected(event) {
    const file = event.target.files[0] as File;
    if (file) {
      if (file.size <= 2097152) {
        this.uploadingImage = true;
        this.uploadImageService.uploadImage(file, this.user.uId, this.user.fullName).then(imageUrl => {
          this.uploadingImage = false;
          this.user.profilePicUrl = imageUrl;
          this.generalForm.markAsTouched();
        });
      } else {
        this.showToast('Images should be smaller than 2 Mb size!!', 'red', 6000);
      }
    }
  }

  showToast(message: string, color: string, time: number = 4000) {
    this.toastService.show(message, time, color );
  }

  logOutUser() {
    this.userService.logout()
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch(error => alert(error));
  }

  ngOnDestroy() {
    if (this.generalForm.touched) {
      this.user.profilePicUrl = this.currentUserImage;
    }
    this.subscriptions.unsubscribe();
  }
}
