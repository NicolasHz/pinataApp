import { Component, OnInit, OnDestroy } from '@angular/core';

// Services
import { UserService } from './../../services/user/user.service';
import { EventsService } from '../../services/events/events.service';
import { UtilsService } from '../../services/utils/utils.service';

// Interfaces
import { Evento } from '../../interfaces/evento';

// RxJs
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public events: Array<Evento>;
  public birthdays: Array<Evento>;
  public subscriptions = new Subscription();
  public eventsReady = false;
  public birthdayReady = false;

  constructor(
    private eventService: EventsService,
    private util: UtilsService ) { }

  ngOnInit() {
    this.subscriptions.add(this.eventService.getEvents('birthdays')
    .subscribe(response => {
      this.birthdays = Object.keys(response)
      .map(index => response[index])
      .map((birthday) => this.util.digestYearOfBirthday(birthday))
      .filter((event) => this.util.deleteOldDatesEvents(event))
      .sort((a, b) => this.util.diferenceOfTimeFromNow(b.start) - this.util.diferenceOfTimeFromNow(a.start))
      .slice(0, 3);
      this.birthdayReady = true;
    }));
    this.subscriptions.add(this.eventService.getEvents('events')
    .subscribe(response => {
      this.events = Object.keys(response)
      .map(index => response[index])
      .filter((event) => this.util.deleteOldDatesEvents(event))
      .sort((a, b) => this.util.diferenceOfTimeFromNow(b.start) - this.util.diferenceOfTimeFromNow(a.start))
      .slice(0, 3);
      this.eventsReady = true;
    }));
  }

  ngOnDestroy () {
    this.subscriptions.unsubscribe();
  }
}
