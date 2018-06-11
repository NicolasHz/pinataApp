import { Component, OnInit, OnDestroy } from '@angular/core';

// Services
import { UserService } from './../../services/user/user.service';
import { EventsService } from '../../services/events/events.service';
import { UtilsService } from '../../services/utils/utils.service';
import { MzToastService } from 'ng2-materialize';

// Interfaces
import { Evento } from '../../interfaces/evento';
import { User } from './../../interfaces/user';

// RxJs
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public events: Evento[] = [];
  public calendarEvents = [];
  public birthdays: Evento[];
  public user: User;
  public subscriptions = new Subscription();
  public eventsReady = false;
  public birthdayReady = false;

  constructor(
    private userService: UserService,
    private toastService: MzToastService,
    private eventService: EventsService,
    private util: UtilsService ) { }

  ngOnInit() {
    this.subscriptions.add(this.eventService.getEvents('birthdays')
    .subscribe(response => {
      this.birthdays = Object.keys(response)
      .map(index => response[index])
      .map(birthday => this.util.digestYearOfBirthday(birthday))
      .filter(event => this.util.deleteOldDatesEvents(event))
      .sort((a, b) => this.util.diferenceOfTimeFromNow(b.start) - this.util.diferenceOfTimeFromNow(a.start))
      .slice(0, 3);
      this.birthdayReady = true;
    }));
    this.subscriptions.add(this.eventService.getEvents('events')
    .subscribe(response => {
      this.events = Object.keys(response)
      .map(index => response[index])
      .filter((event: Evento) => this.util.deleteOldDatesEvents(event))
      .sort((a, b) => this.util.diferenceOfTimeFromNow(b.start) - this.util.diferenceOfTimeFromNow(a.start))
      .slice(0, 3);
      this.eventsReady = true;
    }));
    this.subscriptions.add(this.userService.getUser().subscribe((user: User) => {
      this.user = user;
    }));
    this.subscriptions.add(
      this.eventService.calendarEvents.subscribe(eventsFromCalendar => {
        this.calendarEvents = eventsFromCalendar;
      })
    );
  }

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
    const calendarEventId = this.util.findCalendarEvent(eventData, this.calendarEvents).id;
    if (calendarEventId) {
      this.eventService.deleteCalendarEvent(calendarEventId);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
