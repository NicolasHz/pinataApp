import { Evento, eventInitialState } from '../../interfaces/evento';
import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  public events: Array<Evento>;
  public eventsReady = false;
  constructor(private event: EventsService) { }

  ngOnInit() {
    this.event.getEvents('events')
    .subscribe(response => {
      this.events = Object.keys(response)
      .map(index => response[index]);
      console.log(this.events[0]);
      this.eventsReady = true;
    });
  }
}
