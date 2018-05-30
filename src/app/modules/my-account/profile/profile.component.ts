import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';

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
export class ProfileComponent implements OnInit {
  public errorMessageResources = ERROR_MESSAGES_RESOURCES;
  public datepickerOptions = DATE_OF_BIRTH_PICKER_OPTIONS;
  public generalForm: FormGroup;
  public birthdayListForm: FormGroup;

  constructor(
    private user: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastService: MzToastService) { }

  ngOnInit() {
    this.buildGeneralForm();
    this.buildBirthdayForm();
    this.addPreference();
  }

  buildGeneralForm() {
    this.generalForm = this.formBuilder.group({
      fullName: [null, Validators.required, IsEmptyValidator]
    });
  }

  buildBirthdayForm() {
    this.birthdayListForm = this.formBuilder.group({
      dayOfBirth : [null, Validators.required],
      preferences: this.formBuilder.array([])
    });
  }

  addPreference(): void {
    const preferenceControl = <FormArray>this.birthdayListForm.get('preferences');
    const newPreferenceGroup = this.formBuilder.group({
      preference: ['', [Validators.required, IsEmptyValidator]],
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
    console.log(event.target.checked)
  }

  submitForm() {

  }

  cancelForm() {

  }

  showToast(message: string, color: string) {
    this.toastService.show(message, 4000, color );
  }

  logOutUser() {
    this.user.logout()
    .then(() => {
      this.router.navigate(['/login']);
    });
  }
}
