import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { Evento } from './../../interfaces/evento';
import { UserService } from './../user/user.service';
import { CalendarEventI } from './../../interfaces/calendar-event';
import * as moment from 'moment';

@Injectable()
export class UtilsService {
  private user: User;
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
          if (calendarObject.start.dateTime === eventData.start
            && calendarObject.end.dateTime === eventData.end
            && calendarObject.description === eventData.description) {
            return true;
          }else {
            return false;
          }
      });
  }

  deleteOldDatesEvents(event) {
      return event.start >= moment(new Date).format();
  }
}
