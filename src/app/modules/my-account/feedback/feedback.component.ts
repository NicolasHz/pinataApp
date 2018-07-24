import { Component, OnInit, OnDestroy } from '@angular/core';

// Form
import { ERROR_MESSAGES_RESOURCES } from './../../../shared/options/date-time-pickers';
import { FormBuilder, FormGroup, Validators } from '../../../../../node_modules/@angular/forms';
import { IsEmptyValidator } from '../../../shared/validators/validators';

// Services
import { MzToastService } from '../../../../../node_modules/ngx-materialize';
import { EventsService } from '../../../services/events/events.service';

// Interfaces
import { User } from './../../../interfaces/user';
import { Feedback } from '../../../interfaces/feedback';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import { Subscription } from '../../../../../node_modules/rxjs';
import { first } from 'rxjs/operators';
import { MASTER_EMAIL_ACCOUNT } from '../../../shared/constants';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit, OnDestroy {
  public feedBackForm: FormGroup;
  public errorMessageResources = ERROR_MESSAGES_RESOURCES;
  public subscriptions: Subscription = new Subscription();
  private masterEmail = MASTER_EMAIL_ACCOUNT;
  private user: User;
  public submited: boolean;
  constructor(
    private store: Store<fromRoot.State>,
    private formBuilder: FormBuilder,
    private toastService: MzToastService,
    private eventService: EventsService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.store.select('user')
        .subscribe((user: User) => {
          this.user = user;
        })
    );
    this.subscriptions.add(this.eventService.getFromDatabase('pinataEmail')
      .pipe(first())
      .subscribe(response => {
        this.masterEmail = Object.keys(response)
          .map(index => response[index])[0].masterAccountEmail;
      })
    );
    this.buildFeedbackForm();
  }

  buildFeedbackForm() {
    this.submited = false;
    this.feedBackForm = this.formBuilder.group({
      title: [null, Validators.required],
      message: [
        null,
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(20),
          IsEmptyValidator
        ]
      ],
      opinion: ['like'],
    });
  }

  resetForm() {
    this.feedBackForm.reset();
    this.feedBackForm.controls['opinion'].setValue('like');
    this.submited = false;
    this.feedBackForm.enable();
  }

  submitForm() {
    this.submited = true;
    this.feedBackForm.disable();
    const feedback: Feedback = Object.assign({}, this.feedBackForm.value);
    feedback.message = `From: ${this.user.fullName} \n`
      + `Email: ${this.user.email} \n`
      + `General opinion: ${feedback.opinion} \n`
      + `\n`
      + `Comments:\n${feedback.message}`;
    this.subscriptions.add(
      this.eventService.sendEmail([this.masterEmail], feedback.title, feedback.message)
        .pipe(first())
        .subscribe(response => {
          if (response.accepted) {
            this.showToast('Message sended!', 'green');
            this.resetForm();
          } else {
            this.showToast('Please try again!', 'red');
          }
        })
    );
  }

  showToast(message: string, color: string, time: number = 4000) {
    this.toastService.show(message, time, color);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
