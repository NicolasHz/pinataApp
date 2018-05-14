import { Evento } from './../../interfaces/evento';
import { Injectable } from '@angular/core';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { MzModalService } from 'ng2-materialize';
import { BirthdayModalComponent } from '../../modules/birthday/birthday-modal/birthday-modal.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { CalendarEventI } from './../../interfaces/calendar-event';
import { UserService } from './../user/user.service';

declare var gapi: any;
declare let $: any;
@Injectable()
export class EventsService {
  public calendarEvents: any[];

  constructor(
    private modalService: MzModalService,
    private db: AngularFirestore,
    private userService: UserService
  ) {
      this.updateCalendarArr();
   }

  getEvents(eventsType: string) {
    return this.db
    .collection(eventsType)
    .snapshotChanges()
    .map(docArray => {
      return docArray.map(doc => {
        return{
          id: doc.payload.doc.id,
          ...doc.payload.doc.data()
        };
      });
    });
  }

  addEvent(eventsType: string, event: Evento) {
    this.db.collection(eventsType)
    .add(event)
    .then(() => {
      console.log('Document successfully written!');
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
    });
  }

  updateEvent(eventsType: string, event: Evento) {
    this.db.collection(eventsType)
    .doc(event.id)
    .set(event)
    .then(() => {
      console.log('Document successfully written!');
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
    });
  }

  deleteEvent(eventsType: string, event: Evento) {
    this.db.collection(eventsType)
    .doc(event.id)
    .delete()
    .then(() => {
      console.log('Document successfully deleted!');
    }).catch((error) => {
        console.error('Error removing document: ', error);
    });
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
    eventClick: (calEvent, jsEvent, view) => {
      this.modalService.open(BirthdayModalComponent, {calEvent, jsEvent, view});
      // console.log(jsEvent.currentTarget.style) if you want to look for style options.....
      // jsEvent.currentTarget.style.borderColor = 'red';
    }
    });
  }


  updateCalendarArr() {
    this.getEventsFromCalendar().then((response) => this.calendarEvents = response);
  }

  getEventsFromCalendar(): Promise<any> {
     return this.userService.getCalendarApi().then(() => {
      return gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date(new Date().setMonth(new Date().getMonth() - 2))).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 300,
        'orderBy': 'startTime'
      }).then((response) => {
        return response.result.items;
      });
    });
  }

  deleteCalendarEvent(id: string): Promise<boolean> {
    return this.userService.getCalendarApi()
    .then( () => {
      gapi.client.calendar.events.delete({
        'calendarId': 'primary',
        'eventId': id
      })
      .execute((response) => {
        if (response.error || response === false) {
          console.log('Error at delete calendar Event');
        }else {
          this.updateCalendarArr();
          console.log('Success at delete calendar Event');
        }
      });
      return true;
    })
    .catch(() => false);
  }

  addEventToCalendar(eventToAdd: CalendarEventI): Promise<boolean> {
    return this.userService.getCalendarApi().then( () => {
      gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': eventToAdd
      }).execute((event) => {
        this.updateCalendarArr();
        return event;
      });
      return true;
    }).catch(() => false);
  }
}