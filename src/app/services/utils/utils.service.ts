import { Injectable } from '@angular/core';

// Interfaces
import { User } from '../../interfaces/user';
import { Evento } from './../../interfaces/evento';
import { CalendarEventI } from './../../interfaces/calendar-event';

// Utils
import * as moment from 'moment';
import { ENCODE32, DECODE32 } from './encode-decode';

@Injectable()
export class UtilsService {
  // private a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  public encode32 = ENCODE32;
  public decode32 = DECODE32;

  constructor() { }

  scrolled(doc: Document) {
    const isOpera = navigator.userAgent.indexOf('Opera/') > -1;
    const isChrome = navigator.userAgent.indexOf('Chrome/') > -1;
    const isFirefox = navigator.userAgent.indexOf('Firefox/') > -1;
    const isExplorer = navigator.userAgent.indexOf('Trident/') > -1;
    const isSafari = navigator.userAgent.indexOf('Safari/') > -1;
    const bodyTop = doc.body.scrollTop;
    const toTop = doc.documentElement.scrollTop;

    if (isChrome || isExplorer || isFirefox || isOpera) {
      if (toTop > 50) {
        return true;
      } else if (this.scrolled && toTop < 5) {
        return false;
      }
    } else if (isSafari) {
      if (bodyTop > 50) {
        return true;
      } else if (this.scrolled && bodyTop < 5) {
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

  isEventCreator(eventData: Evento, user: User) {
    return eventData.creator.uId === user.uId;
  }

  findCurrentUser(eventData: Evento, user: User) {
    return eventData.participants.find(o => o.uId === user.uId);
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

  getCurrentUserEvents(event: Evento, user: User): boolean {
    return event.creator.uId === user.uId;
  }

  getJoinedEvents(event: Evento, user: User): boolean {
    return event.participants.some(participant => {
      return participant.uId === user.uId;
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

  digestYearOfBirthday(birthday): Evento {
    const incomingYear = moment(birthday.start).format('YYYY');
    birthday.start = birthday.start.replace(incomingYear, new Date().getFullYear());
    birthday.end = birthday.end.replace(incomingYear, new Date().getFullYear());
    return birthday;
  }

  isTodayBirthday(user: User): boolean {
    const incomingYear = moment(user.dateOfBirth).format('YYYY');
    const updatedBirthDay = user.dateOfBirth.replace(incomingYear, new Date().getFullYear().toString());
    const birthDay = moment(updatedBirthDay).format('YYYY-MM-DD');
    const now = moment(new Date()).format('YYYY-MM-DD');
    return birthDay === now;
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
