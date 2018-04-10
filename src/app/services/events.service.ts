import { Evento } from './../interfaces/evento';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { MzModalService } from 'ng2-materialize';
import { BirthdayModalComponent } from '../modules/birthday/birthday-modal/birthday-modal.component';
import { AngularFirestore } from 'angularfire2/firestore';

declare let $: any;
@Injectable()
export class EventsService {
  API_PATH = 'https://miseventos-ebcef.firebaseio.com/';
  constructor(
    private http: HttpClient,
    private modalService: MzModalService,
    private db: AngularFirestore
  ) { }

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
  // getEvents(eventsType: string) {
  //   return this.http.get(`${this.API_PATH}${eventsType}.json`)
  //   .map(response => response);
  // }

  addEvent(eventsType: string, event: Evento) {
    this.db.collection(eventsType).add(event);
  }

  updateEvent() {
    alert('not implemented');
  }

  deleteEvent() {
    alert('not implemented');
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
}
