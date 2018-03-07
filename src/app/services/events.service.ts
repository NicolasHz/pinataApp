import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'fullcalendar';
import 'fullcalendar-scheduler';

declare let $: any;
@Injectable()
export class EventsService {

  constructor(private http: HttpClient) { }
  API_PATH = 'https://miseventos-ebcef.firebaseio.com/';

  getEvents(eventsType: string) {
    return this.http.get(`${this.API_PATH}${eventsType}.json`)
    .map(response => response);
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
    events: eventType
    });
  }
}
