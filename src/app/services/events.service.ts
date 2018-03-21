import { Evento } from './../interfaces/evento';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import { MzModalService } from 'ng2-materialize';
import { BirthdayModalComponent } from '../modules/birthday/birthday-modal/birthday-modal.component';

declare let $: any;
@Injectable()
export class EventsService {
  API_PATH = 'https://miseventos-ebcef.firebaseio.com/';
  constructor(
    private http: HttpClient,
    private modalService: MzModalService
  ) { }

  getEvents(eventsType: string) {
    return this.http.get(`${this.API_PATH}${eventsType}.json`)
    .map(response => response);
  }

  addEvent(event: Evento, eventsType: string) {
    return this.http.post(`${this.API_PATH}${eventsType}.json`, event)
    .map((response => response));
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
    selectable: true,
    selectHelper: true,
    editable: true,
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
