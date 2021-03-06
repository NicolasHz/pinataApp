import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MyAccountRoutingModule } from './my-account-routnig.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { MyAccountComponent } from './my-account.component';
import { ProfileComponent } from './profile/profile.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { MyAccountNavComponent } from './my-account-nav/my-account-nav.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { EventFormComponent } from '../event/event-form/event-form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MyAccountRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    FormBuilder
  ],
  declarations: [
    MyAccountComponent,
    ProfileComponent,
    MyEventsComponent,
    MyAccountNavComponent,
    FeedbackComponent
  ],
  entryComponents: [
    EventFormComponent
  ]
})
export class MyAccountModule { }
