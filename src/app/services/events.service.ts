import { Evento } from './../interfaces/evento';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { MzModalService } from 'ng2-materialize';
import { BirthdayModalComponent } from '../modules/birthday/birthday-modal/birthday-modal.component';
import { AngularFirestore } from 'angularfire2/firestore';

declare var gapi: any;
declare let $: any;
@Injectable()
export class EventsService {
  constructor(
    private http: HttpClient,
    private modalService: MzModalService,
    private db: AngularFirestore
  ) {
      gapi.load('client:auth2', this.getEventsFromCalendar);
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



  // Calendar
  getEventsFromCalendar() {
    gapi.client.init({
      apiKey: 'AIzaSyDGIy92a4JYf_3TksdWwGdwhaMxx3W7SrQ',
      clientId: '289697189757-l3muf4hpsin6f3dnt73ka1jvh1ckvnd9.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar'
    }).then( () => {
      gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 100,
        'orderBy': 'startTime'
      }).then((response) => {
        console.log(response.result.items)
      });
    });
  }

  deleteCalendarEvent(id: string) {
    gapi.client.init({
      apiKey: 'AIzaSyDGIy92a4JYf_3TksdWwGdwhaMxx3W7SrQ',
      clientId: '289697189757-l3muf4hpsin6f3dnt73ka1jvh1ckvnd9.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar'
    })
    .then( () => {
      gapi.client.calendar.events.delete({
        'calendarId': 'primary',
        'eventId': id
      }
      ).execute((response) => {
        if (response.error || response === false) {
            alert('Error');
        }else {
            alert('Success');
        }
    });
    });
  }

  addEventToCalendar(eventToAdd) {
    gapi.client.init({
      apiKey: 'AIzaSyDGIy92a4JYf_3TksdWwGdwhaMxx3W7SrQ',
      clientId: '289697189757-l3muf4hpsin6f3dnt73ka1jvh1ckvnd9.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar'
    }).then( () => {
        gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': eventToAdd
    }).execute((event) => {
      console.log('Event created: ' + event.htmlLink);
      });
    });
  }
}
