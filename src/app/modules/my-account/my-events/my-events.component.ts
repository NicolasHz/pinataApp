import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// Interfaces
import { Evento } from '../../../interfaces/evento';
import { User } from '../../../interfaces/user';
import { eventInitialState } from '../../../interfaces/evento-initial-state';

// Services
import { UserService } from '../../../services/user/user.service';
import { EventsService } from '../../../services/events/events.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { MzToastService, MzModalService } from 'ng2-materialize';
import { ModalService } from '../../../services/modal/modal.service';

// Components
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { EventFormComponent } from '../../event/event-form/event-form.component';


@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit, OnDestroy {
  public allEvents: Array<Evento>;
  public events: Array<Evento> = [];
  public eventsReady = false;
  public user: User;
  public view: 'created' | 'joined' = 'created';
  public selectedEvent: Evento = eventInitialState;
  public subscriptions: Subscription = new Subscription();
  @ViewChild(ConfirmModalComponent) confirmModal: ConfirmModalComponent;

  constructor(
    private userService: UserService,
    private eventService: EventsService,
    private toastService: MzToastService,
    private modalService: MzModalService,
    private util: UtilsService
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.eventService.getEvents('events')
    .subscribe(response => {
      this.allEvents = Object.keys(response)
      .map(index => response[index])
      .filter((event: Evento) => this.util.deleteOldDatesEvents(event))
      .sort((a, b) => this.util.diferenceOfTimeFromNow(b.start) - this.util.diferenceOfTimeFromNow(a.start));
      this.onEventsCreated();
      this.eventsReady = true;
    }));
    this.subscriptions.add(this.userService.getUser().subscribe((user: User) => {
      this.user = user;
    }));
  }

  onSwitchEventView() {
    if (this.view === 'created') {
      this.onJoinedEvents();
    }else {
      this.onEventsCreated();
    }
  }

  onJoinedEvents() {
    this.events = this.allEvents.slice().filter((event: Evento) => this.util.getJoinedEvents(event));
    this.view = 'joined';
  }

  onEventsCreated() {
    this.events = this.allEvents.slice().filter((event: Evento) => this.util.getCurrentUserEvents(event));
    this.view = 'created';
  }

  joinEvent(eventData: Evento) {
    eventData.participants.push(this.user);
    this.eventService.addEventToCalendar(eventData)
    .then((success) => {
      if (success) {
        this.eventService.updateEvent('events', eventData);
        if (this.util.findUser(eventData)) {
          this.toastService.show('Joined to event!', 4000, 'green');
        }
      }
    });
  }

  leaveEvent(eventData: Evento) {
    const index = eventData.participants.indexOf(this.util.findUser(eventData));
    eventData.participants.splice(index, 1);
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
