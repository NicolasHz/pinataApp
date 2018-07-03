import { Component, OnInit, OnDestroy } from '@angular/core';

// Services
import { EventsService } from '../../services/events/events.service';
import { UtilsService } from '../../services/utils/utils.service';
import { MzToastService } from 'ngx-materialize';

// Interfaces
import { Evento } from '../../interfaces/evento';
import { User } from './../../interfaces/user';

// RxJs
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public events: Evento[] = [];
  public calendarEvents = [];
  public birthdays: Evento[] = [];
  public user: User;
  public subscriptions = new Subscription();
  public eventsReady = false;
  public birthdayReady = false;
  public disableButton = false;

  constructor(
    private store$: Store<fromRoot.State>,
    private toastService: MzToastService,
    private eventService: EventsService,
    private util: UtilsService) { }

  ngOnInit() {
    this.subscriptions.add(
      this.eventService.getFromDatabase('users')
        .subscribe(response => {
          const users = Object.keys(response)
            .map(index => response[index]);
          users.map((user: User) => {
            if (user.onBirthdayList) {
              this.birthdays.push(this.userToBirthday(user));
            }
          });
          this.birthdays = this.birthdays.map(birthday => this.util.digestYearOfBirthday(birthday))
            .filter(event => this.util.deleteOldDatesEvents(event))
            .sort((a, b) => this.util.diferenceOfTimeFromNow(b.start) - this.util.diferenceOfTimeFromNow(a.start))
            .slice(0, 3);
          this.birthdayReady = true;
        })
    );
    // this.subscriptions.add(this.eventService.getFromDatabase('birthdays')
    // .subscribe(response => {
    //   this.birthdays = Object.keys(response)
    //   .map(index => response[index])
    //   .map(birthday => this.util.digestYearOfBirthday(birthday))
    //   .filter(event => this.util.deleteOldDatesEvents(event))
    //   .sort((a, b) => this.util.diferenceOfTimeFromNow(b.start) - this.util.diferenceOfTimeFromNow(a.start))
    //   .slice(0, 3);
    //   this.birthdayReady = true;
    // }));
    this.subscriptions.add(
      this.eventService.getFromDatabase('events')
        .subscribe(response => {
          this.events = Object.keys(response)
            .map(index => response[index])
            .filter((event: Evento) => this.util.deleteOldDatesEvents(event))
            .sort((a, b) => this.util.diferenceOfTimeFromNow(b.start) - this.util.diferenceOfTimeFromNow(a.start))
            .slice(0, 3);
          this.eventsReady = true;
        })
    );
    this.subscriptions.add(
      this.store$.select('user')
        .subscribe((user: User) => {
          this.user = user;
        })
    );
    this.subscriptions.add(
      this.store$.select('calendar').subscribe(eventsFromCalendar => {
        this.calendarEvents = eventsFromCalendar;
      })
    );
  }

  userToBirthday(user: User) {
    const userToBirthday: Evento = {
      description: user.fullName + ' Birthday',
      creator: user,
      editable: false,
      end: user.dateOfBirth + 'T23:59:59-03:00',
      id: user.uId,
      image: user.profilePicUrl,
      preferences: user.preferences,
      start: user.dateOfBirth + 'T00:00:01-03:00',
      title: user.fullName
    };
    return userToBirthday;
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
    const calendarEventId = this.util.findCalendarEvent(eventData, this.calendarEvents).id;
    if (calendarEventId) {
      this.eventService.deleteCalendarEvent(calendarEventId);
    }
    this.disableButton = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
