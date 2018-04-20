import { Evento, eventInitialState } from '../../interfaces/evento';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { EventFormComponent } from './event-form/event-form.component';
import { MzModalService, MzToastService } from 'ng2-materialize';
import { UtilsService } from '../../services/utils.service';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  public events: Array<Evento>;
  public eventsReady = false;
  public user: User;
  selectedEvent: Evento = eventInitialState;
  @ViewChild(ConfirmModalComponent) confirmModal: ConfirmModalComponent;
  constructor(
    private eventService: EventsService,
    private modalService: MzModalService,
    private util: UtilsService,
    private userService: UserService,
    private toastService: MzToastService) { }

  ngOnInit() {
    this.eventService.getEvents('events')
    .subscribe(response => {
      this.events = Object.keys(response)
      .map(index => response[index]);
      this.eventsReady = true;
    });
    this.user = this.userService.getUser();
  }

  openEventForm() {
    this.modalService.open(EventFormComponent);
  }

  // Card and Confirm-Modal Interaction

  joinEvent(eventData: Evento) {
    eventData.participants.push(this.user);
    this.eventService.updateEvent('events', eventData);
    if (this.util.findUser(eventData)) {
      this.toastService.show('Joined to event!', 4000, 'green');
    }
    const calendarEvent = {
      summary: eventData.title,
      location: eventData.place,
      description: eventData.description,
      start: {
          dateTime: eventData.start,
          timeZone: 'America/Los_Angeles'
      },
      end: {
          dateTime: eventData.end,
          timeZone: 'America/Los_Angeles'
      },
      recurrence: [
        'RRULE:FREQ=DAILY;COUNT=1'
      ],
      attendees: [{email: 'nicolasholzman@hotmail.com'}],
      reminders: {
          useDefault: false,
          overrides: [
            {method: 'email', minutes: 24 * 60},
            {method: 'popup', minutes: 10}
          ]
      }
    };
    this.eventService.addEventToCalendar(calendarEvent);
  }

  leaveEvent(eventData: Evento) {
    const index = eventData.participants.indexOf(this.util.findUser(eventData));
    eventData.participants.splice(index);
    this.eventService.updateEvent('events', eventData);
    if (!this.util.findUser(eventData)) {
      this.toastService.show('Event leaved!', 4000, 'red');
    }
    this.eventService.deleteCalendarEvent(this.util.findCalendarEvent(eventData, this.eventService.calendarEvents).id);
  }

  editEvent(eventData: Evento) {
    const editingEvent = true;
    this.modalService.open(EventFormComponent, {eventData, editingEvent});
  }

  confirmDelete(eventData: Evento) {
    this.selectedEvent = eventData;
    this.confirmModal.confirmModal.open();
  }

  deleteEvent(response: boolean) {
    if (response) {
      this.eventService.deleteEvent('events', this.selectedEvent);
      this.toastService.show('Event Deleted!', 4000, 'green' );
    }else {
      this.toastService.show('Canceled', 4000, 'red' );
    }
  }
}
