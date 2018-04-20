import { Component, OnInit } from '@angular/core';

import { EventsService } from '../../services/events.service';
import { Evento } from '../../interfaces/evento';

@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.scss']
})
export class BirthdayComponent implements OnInit {
  public birthdays: Array<Evento>;
  public birthdayReady = false;
  constructor(private eventService: EventsService) { }

  ngOnInit() {
    this.eventService.getEvents('birthdays')
    .subscribe(response => {
      this.birthdays = Object.keys(response)
      .map(index => response[index]);
      this.eventService.createCalendar(this.birthdays);
      this.birthdayReady = true;
    });
    this.eventService.getEventsFromCalendar().then(r => console.log(r));
  }
}
