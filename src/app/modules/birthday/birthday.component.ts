import { Component, OnInit } from '@angular/core';

import { EventsService } from '../../services/events.service';
import { Evento } from '../../interfaces/evento';

@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.scss']
})
export class BirthdayComponent implements OnInit {
  public birthdays: Array<Event>;
  public birthdayReady = false;
  constructor(private event: EventsService) { }

  ngOnInit() {
    this.event.getEvents('birthdays')
    .subscribe(response => {
      this.birthdays = Object.keys(response)
      .map(personNamedIndex => response[personNamedIndex]);
      this.event.createCalendar(this.birthdays);
      this.birthdayReady = true;
    });
  }


}
