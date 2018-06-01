import { User } from './../../../interfaces/user';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl} from '@angular/forms';
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
  public birthdayListForm: FormGroup;
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
    this.buildGeneralForm();
    this.buildBirthdayForm();
  }

  ngAfterViewInit() {
    this.onBirthdayList.nativeElement.value = this.user.onBirthdayList;
    this.onBirthdayList.nativeElement.checked = this.user.onBirthdayList;
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
    this.birthdayListForm = this.formBuilder.group({
      dayOfBirth : [this.user.dateOfBirth, Validators.required],
      preferences: this.formBuilder.array(userPreferences)
    });
    this.addPreference();
  }

  addPreference(): void {
    const preferenceControl = <FormArray>this.birthdayListForm.get('preferences');
    const newPreferenceGroup = this.formBuilder.group({
      preference: ['', [Validators.required, IsEmptyValidator, Validators.maxLength(15)]],
    });
    preferenceControl.push(newPreferenceGroup);
  }

  getPreferences(): AbstractControl[] {
    return (<FormArray>this.birthdayListForm.get('preferences')).controls;
  }

  deletePreference(index: number) {
    const phoneNumbersControl = <FormArray>this.birthdayListForm.get('preferences');
    phoneNumbersControl.removeAt(index);
  }

  toggleBirthdayList(event) {
    this.user.onBirthdayList = event.target.checked;
  }

  submitForm() {

  }

  cancelForm() {

  }

  uploadUserImage() {
    
  }

  showToast(message: string, color: string) {
    this.toastService.show(message, 4000, color );
  }

  logOutUser() {
    this.userService.logout()
    .then(() => {
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
