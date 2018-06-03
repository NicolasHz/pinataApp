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
import { MzToastService } from 'ng2-materialize';

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
  @ViewChild('onBirthdayListChk') onBirthdayList: ElementRef;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastService: MzToastService) { }

  ngOnInit() {
    this.subscriptions.add(this.userService.getUser().subscribe((user: User) => {
      this.user = user;
    }));
    this.initForms();
  }

  ngAfterViewInit() {
    this.onBirthdayList.nativeElement.value = this.user.onBirthdayList;
    this.onBirthdayList.nativeElement.checked = this.user.onBirthdayList;
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
      this.user.preferences.map((preference) => {
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
    const preferenceControl = <FormArray>this.generalForm.get('preferences');
    const newPreferenceGroup = this.formBuilder.group({
      preference: ['', [Validators.required, IsEmptyValidator, Validators.maxLength(15)]],
    });
    preferenceControl.push(newPreferenceGroup);
    this.generalForm.markAsTouched();
  }

  getPreferences(): AbstractControl[] {
    return (<FormArray>this.generalForm.get('preferences')).controls;
  }

  deletePreference(index: number) {
    const phoneNumbersControl = <FormArray>this.generalForm.get('preferences');
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
  }

  submitForm() {
    if (!this.user.onBirthdayList) {
      this.user.fullName = this.generalForm.value.fullName;
    } else {
      const preferences = [];
      this.generalForm.value.preferences.map((preference) => {
        preferences.push(preference.preference);
      });
      this.user = {
        ...this.user,
        dateOfBirth: this.generalForm.value.dateOfBirth,
        preferences: preferences,
      };
    }
    this.userService.addUser(this.user);
  }

  cancelForm() {
    this.initForms();
  }

  onFileSelected(event) {
    const file = <File>event.target.files[0];
    console.log(file)
  }

  showToast(message: string, color: string) {
    this.toastService.show(message, 4000, color );
  }

  logOutUser() {
    this.userService.logout()
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch((error) => alert(error));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
