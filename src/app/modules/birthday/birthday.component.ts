import { Component, OnInit } from '@angular/core';

import { Evento } from '../../interfaces/evento';
import 'fullcalendar';

import { EventsService } from '../../services/events/events.service';
import { MzModalService } from 'ng2-materialize';
import { BirthdayModalComponent } from './birthday-modal/birthday-modal.component';

declare let $: any;
@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.scss']
})
export class BirthdayComponent implements OnInit {
  public birthdays: Array<Evento>;
  public birthdayReady = false;
  constructor(private eventService: EventsService, private modalService: MzModalService) { }

  ngOnInit() {
    this.eventService.getEvents('birthdays')
    .subscribe(response => {
      this.birthdays = Object.keys(response)
      .map(index => response[index]);
      this.createCalendar(this.birthdays);
      this.birthdayReady = true;
    });
    // this.eventService.getEventsFromCalendar().then(r => console.log(r));
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
      displayEventTime: false,
      eventClick: (calEvent, jsEvent, view) => {
        this.modalService.open(BirthdayModalComponent, {calEvent, jsEvent, view});
        // console.log(jsEvent.currentTarget.style) if you want to look for style options.....
        // jsEvent.currentTarget.style.borderColor = 'red';
      }
    });
  }
}
