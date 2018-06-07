import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

import { EventFormComponent } from './event-form/event-form.component';

// Interfaces
import { User } from '../../interfaces/user';
import { Evento } from '../../interfaces/evento';
import { eventInitialState } from './../../interfaces/evento-initial-state';

// Services
import { MzModalService, MzToastService } from 'ng2-materialize';
import { UtilsService } from '../../services/utils/utils.service';
import { UserService } from '../../services/user/user.service';
import { EventsService } from '../../services/events/events.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

// RxJs
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit, AfterViewInit, OnDestroy {
  public events: Evento[] = [];
  public eventsReady = false;
  public user: User;
  public users: User[];
  public selectedEvent: Evento = eventInitialState;
  public subscriptions: Subscription = new Subscription();

  @ViewChild(ConfirmModalComponent) confirmModal: ConfirmModalComponent;
  @ViewChild('featureDiscovery') firstTimeIn;

  constructor(
    private eventService: EventsService,
    private modalService: MzModalService,
    private util: UtilsService,
    private userService: UserService,
    private toastService: MzToastService) { }

  ngOnInit() {
    this.subscriptions.add(this.eventService.getEvents('events')
    .subscribe(response => {
      this.events = Object.keys(response)
      .map(index => response[index])
      .filter((event: Evento) => this.util.deleteOldDatesEvents(event))
      .sort((a, b) => this.util.diferenceOfTimeFromNow(b.start) - this.util.diferenceOfTimeFromNow(a.start));
      this.eventsReady = true;
    }));
    this.subscriptions.add(this.userService.getUser()
    .subscribe((user: User) => {
      this.user = user;
    }));
    this.subscriptions.add(this.userService.getUsers()
    .subscribe(response => {
      this.users = Object.keys(response)
      .map(index => response[index]);
    }));
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
    eventData.participants.push(this.user);
    this.eventService.addEventToCalendar(eventData)
    .then(success => {
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
    this.modalService.open(EventFormComponent, {user: this.user, users: this.users, eventData, editingEvent: true});
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
