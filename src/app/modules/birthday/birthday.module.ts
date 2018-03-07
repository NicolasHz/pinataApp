import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BirthdayRoutingModule } from './birthday-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { BirthdayComponent } from './birthday.component';
import { EventsService } from '../../services/events.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BirthdayRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    BirthdayComponent
  ],
  providers: [
    EventsService
  ]
})
export class BirthdayModule { }
