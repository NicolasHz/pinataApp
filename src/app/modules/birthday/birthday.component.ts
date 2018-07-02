import { Component, OnInit, OnDestroy } from '@angular/core';

// Interfaces
import { Evento } from '../../interfaces/evento';
import { User } from '../../interfaces/user';
import 'fullcalendar';

// Component
import { BirthdayModalComponent } from './birthday-modal/birthday-modal.component';

// Services
import { EventsService } from '../../services/events/events.service';
import { MzModalService } from 'ngx-materialize';
import { UtilsService } from '../../services/utils/utils.service';

// rxJs
import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operators/take';

// NgRx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

declare let $: any;
@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.scss']
})
export class BirthdayComponent implements OnInit, OnDestroy {
  public birthdays: Evento[] = [];
  public birthdayReady = false;
  public subscriptions: Subscription = new Subscription();
  public isglobantUser = false;
  public spreadsheetURL = '/birthdays';
  constructor(
    private eventService: EventsService,
    private modalService: MzModalService,
    private store: Store<fromRoot.State>,
    private util: UtilsService) { }

  ngOnInit() {
    // this.subscriptions.add(this.eventService.getFromDatabase('birthdays')
    //   .subscribe(response => {
    //     this.birthdays = Object.keys(response)
    //     .map(index => response[index]);
    //     this.birthdays.map(birthday => this.util.digestYearOfBirthday(birthday));
    //     this.createCalendar(this.birthdays);
    //     this.birthdayReady = true;
    //   })
    // );
    this.subscriptions.add(this.eventService.getFromDatabase('users')
    .subscribe(response => {
      const users = Object.keys(response)
      .map(index => response[index]);
      users.map((user: User) => {
        if (user.onBirthdayList) {
          this.userToBirthday(user);
        }
      });
      this.birthdays.map(birthday => this.util.digestYearOfBirthday(birthday));
      this.createCalendar(this.birthdays);
      this.birthdayReady = true;
    })
  );
    this.subscriptions.add(this.eventService.getFromDatabase('birthdaySpreadsheetLink')
      .pipe(take(1)).subscribe(response => {
        this.spreadsheetURL = Object.keys(response)
        .map(index => response[index])[0].url;
      })
    );
    this.subscriptions.add(this.store.select('user')
      .subscribe((user: User) => {
        this.isglobantUser = this.util.isGlobantUser(user);
      })
    );
  }

  createCalendar(eventType) {
    $('#calendar').fullCalendar({
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      header: {
      right: 'prev,next today',
      center: 'title',
      left: 'month,agendaWeek,agendaDay'
      },
      themeSystem: 'bootstrap3',
      selectable: false,
      selectHelper: false,
      editable: false,
      eventLimit: true,
      events: eventType,
      nowIndicator: true ,
      displayEventTime: false,
      eventClick: (calEvent, jsEvent, view) => {
        this.modalService.open(BirthdayModalComponent, {calEvent, jsEvent, view});
        // console.log(jsEvent.currentTarget.style) if you want to look for style options.....
        // jsEvent.currentTarget.style.borderColor = 'red';
      }
    });
  }

  printBDSpreadsheet() {
    window.open(this.spreadsheetURL, '_blank');
  }

  userToBirthday(user: User) {
    const userToBirthday: Evento = {
      description: '',
      creator: user,
      editable: false,
      end: user.dateOfBirth + 'T23:59:59-03:00',
      id: user.uId,
      image: user.profilePicUrl,
      preferences: user.preferences,
      start: user.dateOfBirth + 'T00:00:01-03:00',
      title: user.fullName
    };
    this.birthdays.push(userToBirthday);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
