import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventRoutingModule } from './event-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Services
import { EventsService } from '../../services/events.service';
// Components
import { EventComponent } from './event.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EventRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    EventComponent
  ],
  providers: [
    EventsService
  ]
})
export class EventModule { }
