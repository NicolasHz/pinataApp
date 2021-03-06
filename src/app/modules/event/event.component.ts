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
  private tryedTimes = 0;

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
      })
    );
  }

  ngAfterViewInit() {
    if (this.user.isNewUser) {
      setTimeout(() => this.firstTimeIn.open(), 3000);
    }
  }

  openEventForm() {
    this.modalService.open(EventFormComponent, { user: this.user, users: this.users });
  }

  // Card and Confirm-Modal Interaction

  joinEvent(eventData: Evento) {
    this.disableButton = true;
    const calendarEvent = this.util.findCalendarEvent(eventData, this.calendarEvents);
    if (calendarEvent) {
      eventData.participants.push(this.user);
      this.eventService.updateCalendarEvent(calendarEvent.id, eventData)
        .pipe(first())
        .subscribe(success => {
          if (success) {
            this.eventService.updateEvent('events', eventData)
              .pipe(first())
              .subscribe(updated => {
                if (updated && this.util.findCurrentUser(eventData, this.user)) {
                  this.toastService.show('Joined to event!', 4000, 'green');
                }
              });
          } else {
            this.toastService.show('Please try again!', 4000, 'black');
          }
          this.disableButton = false;
        });
    } else {
      if (this.tryedTimes >= 2) {
        eventData.participants.push(this.user);
        this.eventService.addEventToCalendar(eventData)
          .pipe(first())
          .subscribe(success => {
            if (success) {
              this.eventService.updateEvent('events', eventData)
                .pipe(first())
                .subscribe(updated => {
                  if (updated && this.util.findCurrentUser(eventData, this.user)) {
                    this.toastService.show('Joined to event!', 4000, 'green');
                  }
                  this.tryedTimes = 0;
                  this.disableButton = false;
                });
            } else {
              this.toastService.show('Please try again!', 4000, 'black');
              this.disableButton = false;
            }
          });
      } else {
        this.tryedTimes++;
        this.toastService.show('Please try again!', 4000, 'black');
        this.disableButton = false;
      }
    }
    this.eventService.getEventsFromCalendar();
  }

  leaveEvent(eventData: Evento) {
    this.disableButton = true;
    const calendarEvent = this.util.findCalendarEvent(eventData, this.calendarEvents);
    if (calendarEvent) {
      const userIndex = eventData.participants.indexOf(this.util.findCurrentUser(eventData, this.user));
      eventData.participants.splice(userIndex, 1);
      this.eventService.updateCalendarEvent(calendarEvent.id, eventData)
        .pipe(first())
        .subscribe(success => {
          if (success) {
            this.eventService.updateEvent('events', eventData)
              .pipe(first())
              .subscribe(updated => {
                if (updated && !this.util.findCurrentUser(eventData, this.user)) {
                  this.toastService.show('Event leaved!', 4000, 'red');
                }
              });
          } else {
            this.toastService.show('Please try again!', 4000, 'black');
          }
          this.disableButton = false;
        });
    } else {
      if (this.tryedTimes >= 2 && this.util.findCurrentUser(eventData, this.user)) {
        const userIndex = eventData.participants.indexOf(this.util.findCurrentUser(eventData, this.user));
        eventData.participants.splice(userIndex, 1);
        this.eventService.updateEvent('events', eventData)
          .pipe(first())
          .subscribe(updated => {
            if (updated && !this.util.findCurrentUser(eventData, this.user)) {
              this.toastService.show('Event leaved!', 4000, 'red');
            }
            this.tryedTimes = 0;
            this.disableButton = false;
          });
      } else {
        this.tryedTimes++;
        this.toastService.show('Please try again!', 4000, 'black');
        this.disableButton = false;
      }
    }
    this.eventService.getEventsFromCalendar();
  }

  editEvent(eventData: Evento) {
    this.modalService.open(EventFormComponent, { user: this.user, users: this.users, eventData, calendarEvents: this.calendarEvents, editingEvent: true });
  }

  confirmDelete(eventData: Evento) {
    this.selectedEvent = eventData;
    this.confirmModal.confirmModal.openModal();
  }

  deleteEvent(response: boolean) {
    if (response) {
      if (this.selectedEvent.participants.length > 0 && this.util.findCurrentUser(this.selectedEvent, this.user)) {
        this.leaveEvent(this.selectedEvent);
      } else {
        const calendarEvent = this.util.findCalendarEvent(this.selectedEvent, this.calendarEvents);
        if (calendarEvent) {
          this.eventService.deleteCalendarEvent(calendarEvent.id)
            .pipe(first())
            .subscribe(success => {
              if (success) {
                this.eventService.deleteEvent('events', this.selectedEvent)
                  .pipe(first())
                  .subscribe(deleted => {
                    deleted ? this.toastService.show('Event Deleted!', 4000, 'green') : this.toastService.show('Please try again', 4000, 'black');
                  });
              }
            });
        } else {
          this.eventService.deleteEvent('events', this.selectedEvent)
            .pipe(first())
            .subscribe(deleted => {
              deleted ? this.toastService.show('Event Deleted!', 4000, 'green') : this.toastService.show('Please try again', 4000, 'black');
            });
        }
      }
    } else {
      this.toastService.show('Canceled', 4000, 'red');
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
