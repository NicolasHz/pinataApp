import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { take } from 'rxjs/operators/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Evento } from './../../interfaces/evento';

import { CalendarEventI } from './../../interfaces/calendar-event';

import { UtilsService } from '../utils/utils.service';
import { GoogleAuthService } from 'ng-gapi';
import * as moment from 'moment';

declare var gapi: any;
@Injectable()
export class EventsService {
  public calendarEvents: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  private auth;
  constructor(
    private googleAuthService: GoogleAuthService,
    private db: AngularFirestore,
    private util: UtilsService,
  ) {
    db.firestore.settings({ timestampsInSnapshots: true });
    this.googleAuthService.getAuth().pipe(take(1)).subscribe(auth => {
      this.auth = auth;
    });
   }

  getFromDatabase(eventsType: string) {
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

  addEvent(eventsType: string, event: Evento): Promise<any> {
    return this.db.collection(eventsType)
    .add(event)
    .then(createdEvent => {
      console.log('Document successfully written!');
      return createdEvent;
    })
    .catch(error => {
      console.error('Error writing document: ', error);
    });
  }

  updateEvent(eventsType: string, event: Evento) {
    this.db.collection(eventsType)
    .doc(event.id)
    .set(JSON.parse(JSON.stringify(event)))
    .then(() => {
      console.log('Document successfully written!');
    })
    .catch(error => {
      console.error('Error writing document: ', error);
    });
  }

  deleteEvent(eventsType: string, event: Evento) {
    this.db.collection(eventsType)
    .doc(event.id)
    .delete()
    .then(() => {
      console.log('Document successfully deleted!');
    }).catch(error => {
        console.error('Error removing document: ', error);
    });
  }

  //
  // Start calendar API interaction.
  //

  getEventsFromCalendar(): Promise<any> {
    return this.auth.then(() => {
      return gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date(new Date().setMonth(new Date().getMonth() - 2))).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 300,
        orderBy: 'startTime'
      }).then(response => {
        if (!response) {
          return;
        }
        // this.store.dispatch(new Calendar.SetCalendar(response.result.items));
        this.calendarEvents.next(response.result.items);
        return response.result.items;
      }).catch(() => console.log('something wrong at fetching events from calendar'));
    });
  }

  addEventToCalendar(eventToAdd: Evento): Promise<boolean> {
    const calendarEvent = this.createCalendarEvent(eventToAdd);
    calendarEvent.id = this.util.encode32(eventToAdd.id + this.util.makePlusId(5));
    return this.auth.then( () => {
      gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: calendarEvent
      })
      .execute(response => {
        if (!response.error || response !== false) {
          this.getEventsFromCalendar();
        }
      });
      return true;
    })
    .catch(() => false);
  }

  deleteCalendarEvent(id: string): Promise<boolean> {
    return this.auth
    .then( () => {
      gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: id
      })
      .execute(response => {
        if (response.error || response === false) {
          console.log('Error at delete calendar Event');
        } else {
          this.getEventsFromCalendar();
          console.log('Success at delete calendar Event');
        }
      });
      return true;
    })
    .catch(() => false);
  }

  updateCalendarEvent(id: string, eventToUpdate: Evento): Promise<boolean> {
    const calendarEvent = this.createCalendarEvent(eventToUpdate);
    return this.auth
    .then( () => {
      gapi.client.calendar.events.patch({
        calendarId: 'primary',
        eventId: id,
        resource: calendarEvent
      })
      .execute(response => {
        if (response.error || response === false) {
          console.log('Error at update calendar Event');
        } else {
          this.getEventsFromCalendar();
          console.log('Success at update calendar Event');
        }
      });
      return true;
    })
    .catch(() => false);
  }

  createCalendarEvent(eventToAdd: Evento): CalendarEventI {
    return  {
      summary: eventToAdd.title,
      location: eventToAdd.place,
      description: eventToAdd.description,
      start: {
          dateTime: moment(eventToAdd.start).format(),
          timeZone: 'America/Los_Angeles'
      },
      end: {
          dateTime: moment(eventToAdd.end).format(),
          timeZone: 'America/Los_Angeles'
      },
      recurrence: [
        'RRULE:FREQ=DAILY;COUNT=1'
      ],
      // attendees: eventToAdd.participants,
      guestsCanModify: false,
      reminders: {
          useDefault: false,
          overrides: [
            {method: 'email', minutes: 30},
            {method: 'popup', minutes: 10}
          ]
      }
    };
  }
}
