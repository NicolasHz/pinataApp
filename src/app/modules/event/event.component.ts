import { Evento, eventInitialState } from '../../interfaces/evento';
import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { EventFormComponent } from './event-form/event-form.component';
import { MzModalService } from 'ng2-materialize';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  public events: Array<Evento>;
  public eventsReady = false;
  constructor(private event: EventsService, private modalService: MzModalService) { }

  ngOnInit() {
    this.event.getEvents('events')
    .subscribe(response => {
      this.events = Object.keys(response)
      .map(index => response[index]);
      this.eventsReady = true;
    });
  }
  openEventForm() {
    this.modalService.open(EventFormComponent);
  }

  // Card Interaction

}
