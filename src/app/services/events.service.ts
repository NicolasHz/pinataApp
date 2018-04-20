import { Evento } from './../interfaces/evento';
import { Injectable } from '@angular/core';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { MzModalService } from 'ng2-materialize';
import { BirthdayModalComponent } from '../modules/birthday/birthday-modal/birthday-modal.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { CalendarEventI } from './../interfaces/calendar-event';

declare var gapi: any;
declare let $: any;
@Injectable()
export class EventsService {
  public calendarEvents: any[];

  constructor(
    private modalService: MzModalService,
    private db: AngularFirestore
  ) {
      gapi.load('client:auth2', this.initClient);
      setTimeout(() => {
       this.updateCalendarArr()
      }, 3000);
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

  // Calendar interaction
  initClient(): Promise<[{}]> {
    return gapi.client.init({
      apiKey: 'AIzaSyDGIy92a4JYf_3TksdWwGdwhaMxx3W7SrQ',
      clientId: '289697189757-l3muf4hpsin6f3dnt73ka1jvh1ckvnd9.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar'
    });
  }

  updateCalendarArr() {
    this.getEventsFromCalendar().then((response) => this.calendarEvents = response);
  }

  getEventsFromCalendar(): Promise<[{}]> {
     return this.initClient().then(() => {
      return gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 100,
        'orderBy': 'startTime'
      }).then((response) => {
        return response.result.items;
      });
    });
  }

  deleteCalendarEvent(id: string) {
    this.initClient().then( () => {
      gapi.client.calendar.events.delete({
        'calendarId': 'primary',
        'eventId': id
      }
      ).execute((response) => {
        if (response.error || response === false) {
          console.log('Error at delete calendar Event');
        }else {
          this.updateCalendarArr();
          console.log('Success at delete calendar Event');
        }
    });
    });
  }

  addEventToCalendar(eventToAdd: CalendarEventI): Promise<[{}]> {
    return this.initClient().then( () => {
      return gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': eventToAdd
      }).execute((event) => {
        this.updateCalendarArr();
        return event;
      });
    });
  }
}
