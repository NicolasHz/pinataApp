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
import { MzToastService, MzModalService } from 'ngx-materialize';

// Components
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';
import { EventFormComponent } from '../../event/event-form/event-form.component';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit, OnDestroy {
  public allEvents: Evento[];
  public calendarEvents = [];
  public events: Evento[] = [];
  public eventsReady = false;
  public disableButton = false;
  public user: User;
  public users: User[];
  public view: 'created' | 'joined' = 'joined';
  public selectedEvent: Evento = eventInitialState;
  public subscriptions: Subscription = new Subscription();
  @ViewChild(ConfirmModalComponent) confirmModal: ConfirmModalComponent;

  constructor(
    private store$: Store<fromRoot.State>,
    private userService: UserService,
    private eventService: EventsService,
    private toastService: MzToastService,
    private modalService: MzModalService,
    private util: UtilsService
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.eventService.getFromDatabase('events')
        .subscribe(response => {
          this.allEvents = Object.keys(response)
            .map(index => response[index])
            .filter((event: Evento) => this.util.deleteOldDatesEvents(event))
            .sort((a, b) => this.util.diferenceOfTimeFromNow(b.start) - this.util.diferenceOfTimeFromNow(a.start));
          this.onJoinedEvents();
          this.eventsReady = true;
        })
    );
    this.subscriptions.add(this.store$.select('user')
      .subscribe((user: User) => {
        this.user = user;
      })
    );
    this.subscriptions.add(
      this.userService.getUsers()
        .subscribe((users: User[]) => {
          this.users = users;
        })
    );
    this.subscriptions.add(
      this.store$.select('calendar')
        .subscribe(eventsFromCalendar => {
          this.calendarEvents = eventsFromCalendar;
        })
    );
  }

  onSwitchEventView() {
    if (this.view === 'created') {
      this.onJoinedEvents();
    } else {
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
    const calendarEvent = this.util.findCalendarEvent(eventData, this.calendarEvents);
    if (calendarEvent) {
      this.eventService.deleteCalendarEvent(calendarEvent.id);
    }
    this.disableButton = false;
  }

  editEvent(eventData: Evento) {
    this.modalService.open(EventFormComponent, { user: this.user, users: this.users, eventData, editingEvent: true });
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
      this.toastService.show('Event Deleted!', 4000, 'green');
    } else {
      this.toastService.show('Canceled', 4000, 'red');
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
