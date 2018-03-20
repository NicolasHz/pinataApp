import { Evento, eventInitialState } from '../../interfaces/evento';
import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  public events: Array<Evento> = [eventInitialState];
  public eventsReady = false;
  constructor(private event: EventsService) { }

  ngOnInit() {
    this.event.getEvents('events')
    .subscribe(response => {
      this.events = Object.keys(response)
      .map(personNamedIndex => response[personNamedIndex]);
      this.eventsReady = true;
    });
  }
}
