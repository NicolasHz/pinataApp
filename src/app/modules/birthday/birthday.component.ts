import { Component, OnInit, OnDestroy } from '@angular/core';

import { Evento } from '../../interfaces/evento';
import 'fullcalendar';

import { EventsService } from '../../services/events/events.service';
import { MzModalService } from 'ng2-materialize';
import { BirthdayModalComponent } from './birthday-modal/birthday-modal.component';

import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../../services/user/user.service';

declare let $: any;
@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.scss']
})
export class BirthdayComponent implements OnInit, OnDestroy {
  public birthdays: Array<Evento>;
  public birthdayReady = false;
  public unsubscribe: Subscription;
  public globantUser = false;
  constructor(
    private eventService: EventsService,
    private modalService: MzModalService,
    private userService: UserService) { }

  ngOnInit() {
    this.unsubscribe = this.eventService.getEvents('birthdays')
    .subscribe(response => {
      this.birthdays = Object.keys(response)
      .map(index => response[index]);
      this.createCalendar(this.birthdays);
      this.birthdayReady = true;
    });
    // this.eventService.getEventsFromCalendar().then(r => console.log(r));
    this.globantUser = /(?:@globant.com)/.test(this.userService.getUser().email);
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

  printBDSpreadsheet() {
    window.open('https://docs.google.com/spreadsheets/d/1lKo13ZHTg4mJzX_VuxND5cWaoVuvZQpBXatrEV6BmYo/edit#gid=0', '_blank');
  }

  ngOnDestroy() {
    this.unsubscribe.unsubscribe();
  }
}
