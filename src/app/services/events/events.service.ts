import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Evento } from './../../interfaces/evento';
import { CalendarEventI } from './../../interfaces/calendar-event';

import { UtilsService } from '../utils/utils.service';
import { GoogleAuthService } from 'ng-gapi';
import * as moment from 'moment';

import * as fromRoot from '../../app.reducer';
import * as CalendarActions from '../../actions/calendar/calendar.actions';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

declare var gapi: any;
@Injectable()
export class EventsService {
  private calendar;
  constructor(
    private store$: Store<fromRoot.State>,
    private googleAuthService: GoogleAuthService,
    private db: AngularFirestore,
    private util: UtilsService,
  ) {
    db.firestore.settings({ timestampsInSnapshots: true });
    this.googleAuthService.getAuth()
      .pipe(first())
      .subscribe(() => {
        gapi.load('client', () => {
          gapi.client.load('calendar', 'v3', () => {
            this.calendar = gapi.client.calendar;
            this.getEventsFromCalendar();
          });
        });
      });
  }

  getFromDatabase(eventsType: string) {
    return this.db
      .collection(eventsType)
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
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
        return createdEvent.id;
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

  getEventsFromCalendar() {
    this.calendar.events.list({
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
      this.store$.dispatch(new CalendarActions.SetCalendar(response.result.items));
    }).catch(() => console.log('something wrong at fetching events from calendar'));
  }

  addEventToCalendar(eventToAdd: Evento, isBirthday = false): Observable<boolean> {
    const calendarEvent = this.createCalendarEvent(eventToAdd);
    if (isBirthday) {
      calendarEvent.id = this.util.encode32(eventToAdd.id + this.util.makePlusId(2));
    } else {
      calendarEvent.id = this.util.encode32(eventToAdd.id + this.util.makePlusId(5));
    }
    return new Observable(observer => {
      this.calendar.events.insert({
        calendarId: 'primary',
        resource: calendarEvent
      }).execute(response => {
        if (!response.error || response !== false) {
          this.getEventsFromCalendar();
          observer.next(true);
        } else { observer.next(false); }
      });
    });
  }

  deleteCalendarEvent(id: string) {
    this.calendar.events.delete({
      calendarId: 'primary',
      eventId: id
    }).execute(response => {
      if (!response.error || response !== false) {
        this.getEventsFromCalendar();
      }
    });

  }

  updateCalendarEvent(id: string, eventToUpdate: Evento): Observable<boolean> {
    const calendarEvent = this.createCalendarEvent(eventToUpdate);
    return new Observable(observer => {
      this.calendar.events.patch({
        calendarId: 'primary',
        eventId: id,
        resource: calendarEvent
      }).execute(response => {
        if (!response.error || response !== false) {
          this.getEventsFromCalendar();
          observer.next(true);
        } else { observer.next(false); }
      });
    });
  }

  createCalendarEvent(eventToAdd: Evento): CalendarEventI {
    return {
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
          { method: 'email', minutes: 30 },
          { method: 'popup', minutes: 10 }
        ]
      }
    };
  }
}
