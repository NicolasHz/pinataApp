import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { Evento } from './../../interfaces/evento';
import { UserService } from './../user/user.service';
import { CalendarEventI } from './../../interfaces/calendar-event';
import * as moment from 'moment';
import { ENCODE32, DECODE32 } from './encode-decode';
@Injectable()
export class UtilsService {
  private user: User;
  // private a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  public encode32 = ENCODE32;
  public decode32 = DECODE32;

  constructor( private userService: UserService) {
    this.user = this.userService.getUser();
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
     if ( bodyTop > 50 ) {
      return true;
     }else if (this.scrolled && bodyTop < 5) {
      return false;
    }
   }
  }

  isEventCreator(eventData: Evento) {
    return eventData.creator.uId === this.user.uId;
  }

  findUser(eventData: Evento) {
    return eventData.participants.find( o => o.uId === this.user.uId);
  }

  findCalendarEvent(eventData: Evento, calendarEvent: CalendarEventI[]) { // fixMe
    return calendarEvent
      .find( calendarObject =>  {
          const decodedId = this.decode32(calendarObject.id.replace(/_.*/, ''));
          const isId = new RegExp('(?:' + eventData.id + ')').test(decodedId);
          if ( isId ) {
            return true;
          }else {
            return false;
          }
      });
  }

  deleteOldDatesEvents(event) {
      return event.start >= moment(new Date).format();
  }

  makePlusId(finalLength: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < finalLength; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  diferenceOfTimeFromNow(date) {
    const now = new Date();
    return moment.duration(moment(now).diff(moment(date))).asHours();
  }
}
