import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

import { EventFormComponent } from './event-form/event-form.component';

// Interfaces
import { User } from '../../interfaces/user';
import { Evento } from '../../interfaces/evento';
import { eventInitialState } from './../../interfaces/evento-initial-state';

// Services
import { MzModalService, MzToastService } from 'ngx-materialize';
import { UtilsService } from '../../services/utils/utils.service';
import { UserService } from '../../services/user/user.service';
import { EventsService } from '../../services/events/events.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

// RxJs
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, AfterViewInit, OnDestroy {
  public events: Evento[] = [];
  public calendarEvents = [];
  public eventsReady = false;
  public disableButton = false;
  public user: User;
  public users: User[];
  public selectedEvent: Evento = eventInitialState;
  public subscriptions: Subscription = new Subscription();

  @ViewChild(ConfirmModalComponent) confirmModal: ConfirmModalComponent;
  @ViewChild('featureDiscovery') firstTimeIn;

  constructor(
    private store: Store<fromRoot.State>,
    private eventService: EventsService,
    private modalService: MzModalService,
    private util: UtilsService,
    private userService: UserService,
    private toastService: MzToastService) { }

  ngOnInit() {
    this.subscriptions.add(this.eventService.getFromDatabase('events')
    .subscribe(response => {
      this.events = Object.keys(response)
      .map(index => response[index])
      .filter((event: Evento) => this.util.deleteOldDatesEvents(event))
      .sort((a, b) => this.util.diferenceOfTimeFromNow(b.start) - this.util.diferenceOfTimeFromNow(a.start));
      this.eventsReady = true;
    }));
    this.subscriptions.add(this.store.select('user')
    .subscribe((user: User) => {
      this.user = user;
    }));
    this.subscriptions.add(this.userService.getUsers()
    .subscribe(response => {
      this.users = Object.keys(response)
      .map(index => response[index]);
    }));
    this.subscriptions.add(
      this.store.select('calendar').subscribe(events => {
        this.calendarEvents = Object.keys(events)
        .map(index => events[index]);
        // console.log(this.calendarEvents)
      })
    );
  }

  ngAfterViewInit() {
    if (this.user.isNewUser) {
      setTimeout(() => this.firstTimeIn.open(), 3000);
    }
  }

  openEventForm() {
    this.modalService.open(EventFormComponent, {user: this.user, users: this.users});
  }

  // Card and Confirm-Modal Interaction

  joinEvent(eventData: Evento) {
    this.disableButton = true;
    eventData.participants.push(this.user);
    this.eventService.addEventToCalendar(eventData)
    .pipe(first())
    .subscribe(success => {
      if (success) {
        this.eventService.updateEvent('events', eventData);
        if (this.util.findCurrentUser(eventData)) {
          this.toastService.show('Joined to event!', 4000, 'green');
        }
      }
      this.disableButton = false;
    });
  }

  leaveEvent(eventData: Evento) {
    this.disableButton = true;
    const index = eventData.participants.indexOf(this.util.findCurrentUser(eventData));
    eventData.participants.splice(index, 1);
    this.eventService.updateEvent('events', eventData);
    if (!this.util.findCurrentUser(eventData)) {
      this.toastService.show('Event leaved!', 4000, 'red');
    }
    const calendarEventId = this.util.findCalendarEvent(eventData, this.calendarEvents).id;
    if (calendarEventId) {
      this.eventService.deleteCalendarEvent(calendarEventId);
    }
    this.disableButton = false;
  }

  editEvent(eventData: Evento) {
    this.modalService.open(EventFormComponent, {user: this.user, users: this.users, eventData, calendarEvents: this.calendarEvents, editingEvent: true});
  }

  confirmDelete(eventData: Evento) {
    this.selectedEvent = eventData;
    this.confirmModal.confirmModal.openModal();
  }

  deleteEvent(response: boolean) {
    if (response) {
      if (this.selectedEvent.participants.length > 0 && this.util.findCurrentUser(this.selectedEvent)) {
        this.leaveEvent(this.selectedEvent);
      }
      this.eventService.deleteEvent('events', this.selectedEvent);
      this.toastService.show('Event Deleted!', 4000, 'green' );
    } else {
      this.toastService.show('Canceled', 4000, 'red' );
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
