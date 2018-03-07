import { Component, OnInit } from '@angular/core';

import { EventsService } from '../../services/events.service';
import { Event } from '../../interfaces/evento';

@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.scss']
})
export class BirthdayComponent implements OnInit {
  private birthdays: Array<Event>;

  constructor(private event: EventsService) { }

  ngOnInit() {
    this.event.getEvents('birthdays')
    .subscribe(response => {
      this.birthdays = Object.keys(response)
      .map(personNamedIndex => response[personNamedIndex]);
      console.log(this.birthdays)
      this.event.createCalendar(this.birthdays);
    });
  }


}
