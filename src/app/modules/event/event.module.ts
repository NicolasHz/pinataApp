import { FormBuilder, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventRoutingModule } from './event-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { EventComponent } from './event.component';
import { EventFormComponent } from './event-form/event-form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EventRoutingModule,
    FormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    EventComponent
  ],
  providers: [
    FormBuilder,
  ],
  entryComponents: [
    EventFormComponent
  ]
})
export class EventModule { }
