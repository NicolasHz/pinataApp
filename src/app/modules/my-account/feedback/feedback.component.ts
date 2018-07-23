import { Component, OnInit, OnDestroy } from '@angular/core';

// Form
import { ERROR_MESSAGES_RESOURCES } from './../../../shared/options/date-time-pickers';
import { FormBuilder, FormGroup, Validators } from '../../../../../node_modules/@angular/forms';
import { IsEmptyValidator } from '../../../shared/validators/validators';

// Services
import { MzToastService } from '../../../../../node_modules/ngx-materialize';
import { EventsService } from '../../../services/events/events.service';

// Interfaces
import { Feedback } from '../../../interfaces/feedback';

import { Subscription } from '../../../../../node_modules/rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit, OnDestroy {
  public feedBackForm: FormGroup;
  public errorMessageResources = ERROR_MESSAGES_RESOURCES;
  public subscriptions: Subscription = new Subscription();
  private masterEmail = 'pinatabirthdaysevents@gmail.com';
  constructor(
    private formBuilder: FormBuilder,
    private toastService: MzToastService,
    private eventService: EventsService
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.eventService.getFromDatabase('pinataEmail')
      .pipe(first())
      .subscribe(response => {
        this.masterEmail = Object.keys(response)
          .map(index => response[index])[0].masterAccountEmail;
      })
    );
    this.initForm();
  }

  initForm() {
    this.buildFeedbackForm();
  }

  buildFeedbackForm() {
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
    });
  }

  cancelForm() {
    this.feedBackForm.reset();
    this.initForm();
  }

  submitForm() {
    const feedback: Feedback = Object.assign({}, this.feedBackForm.value);
    this.subscriptions.add(
      this.eventService.sendEmail([this.masterEmail], feedback.title, feedback.message)
        .pipe(first())
        .subscribe(success => console.log(success))
    );
  }

  showToast(message: string, color: string, time: number = 4000) {
    this.toastService.show(message, time, color);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
