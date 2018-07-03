import { Injectable } from '@angular/core';

// Interfaces
import { User } from '../../interfaces/user';
import { Evento } from './../../interfaces/evento';
import { CalendarEventI } from './../../interfaces/calendar-event';

// Utils
import * as moment from 'moment';
import { ENCODE32, DECODE32 } from './encode-decode';
import { first } from 'rxjs/operators';

// NgRx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app/app.reducer';
@Injectable()
export class UtilsService {
  private user: User;
  // private a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  public encode32 = ENCODE32;
  public decode32 = DECODE32;

  constructor(private store: Store<fromRoot.State>) {
    this.store.select('user')
      .pipe(first())
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  scrolled(doc: Document) {
    const isChrome = navigator.userAgent.indexOf('Chrome/') > -1;
    const isExplorer = navigator.userAgent.indexOf('Trident/') > -1;
    const bodyTop = doc.body.scrollTop;
    const toTop = doc.documentElement.scrollTop;

    if (isChrome || isExplorer) {
      if (toTop > 50) {
        return true;
      } else if (this.scrolled && toTop < 5) {
        return false;
      }
    } else {
      if (bodyTop > 50) {
        return true;
      } else if (this.scrolled && bodyTop < 5) {
        return false;
      }
    }
  }

  isGlobantUser(user: User) {
    return /(@globant.com)/.test(user.email);
  }

  isEventCreator(eventData: Evento) {
    return eventData.creator.uId === this.user.uId;
  }

  findCurrentUser(eventData: Evento) {
    return eventData.participants.find(o => o.uId === this.user.uId);
  }

  findCalendarEvent(eventData: Evento, calendarEvents: CalendarEventI[]): CalendarEventI { // fixMe
    return calendarEvents
      .find(calendarObject => {
        const decodedId = this.decode32(calendarObject.id.replace(/_.*/, ''));
        const isId = new RegExp('(?:' + eventData.id + ')').test(decodedId);
        if (isId) {
          return true;
        } else {
          return false;
        }
      }
      );
  }

  deleteOldDatesEvents(event: Evento, from = new Date()): boolean {
    return event.end >= moment(from).format();
  }

  getCurrentUserEvents(event: Evento): boolean {
    return event.creator.uId === this.user.uId;
  }

  getJoinedEvents(event: Evento): boolean {
    return event.participants.some(participant => {
      return participant.uId === this.user.uId;
    });
  }

  makePlusId(finalLength: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < finalLength; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  diferenceOfTimeFromNow(date, as: 'hours' | 'minutes' = 'hours') {
    const now = new Date();
    if (as === 'minutes') {
      return moment.duration(moment(now).diff(moment(date))).asMinutes();
    }
    return moment.duration(moment(now).diff(moment(date))).asHours();
  }

  digestYearOfBirthday(birthday) {
    const incomingYear = moment(birthday.start).format('YYYY');
    birthday.start = birthday.start.replace(incomingYear, new Date().getFullYear());
    birthday.end = birthday.end.replace(incomingYear, new Date().getFullYear());
    return birthday;
  }

  isTodayBirthday(birthday: Evento) {
    const incomingYear = moment(birthday.start).format('YYYY-MM-DD');
    const now = moment(new Date()).format('YYYY-MM-DD');
    return incomingYear === now;
  }

  usersToChips(users: User[]): Materialize.ChipDataObject[] {
    const convertedUsers: Materialize.ChipDataObject[] = [];
    if (users.length <= 0) {
      return convertedUsers;
    }
    users.map(user => {
      convertedUsers.push(
        {
          tag: user.fullName,
          image: user.profilePicUrl
        }
      );
    });
    return convertedUsers;
  }
}
