import { Evento, eventInitialState } from './../../interfaces/evento';
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { EventsService } from '../../services/events/events.service';
import { UtilsService } from '../../services/utils/utils.service';
import { trigger, style, state, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-card',
  animations: [
    trigger('flyInOut', [])
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() eventData = eventInitialState;
  @Output() join: EventEmitter<Evento> = new EventEmitter<Evento>();
  @Output() leave: EventEmitter<Evento> = new EventEmitter<Evento>();
  @Output() edit: EventEmitter<Evento> = new EventEmitter<Evento>();
  @Output() delete: EventEmitter<Evento> = new EventEmitter<Evento>();

  public actualImgReady = false;
  public optionsOpened = false;
  public eventAuthor = false;
  public preLoaderImg: string;
  public participants = 0;
  public joined = false; // test porpouses only, needs to be setted from User database
  public showEventTime = false;
  private imgSource = [
    '../../assets/img/party.gif',
    '../../assets/img/party0.gif',
    '../../assets/img/party1.gif',
    '../../assets/img/party2.gif'];
  tooltip = '';

  constructor(
    private eventService: EventsService,
    private util: UtilsService) { }

  ngOnInit() {
    this.preLoaderImg = this.imgSource[Math.floor(Math.random() * this.imgSource.length)];
    this.eventAuthor = this.util.isEventCreator(this.eventData);
    this.participants = this.eventData.participants.length;
    if (this.util.findUser(this.eventData)) {
      this.joined = true;
    }
    this.eventData.participants.map((res) => {
      this.tooltip = this.tooltip + `<img src="${res.profilePicUrl}"/>  ` + res.fullName.concat('<br/>');
    });
  }

  toggleClass() {
    this.showEventTime = !this.showEventTime;
  }

  showImage() {
    this.actualImgReady = true;
  }

  joinEvent() {
    this.join.emit(this.eventData);
  }

  leaveEvent() {
    this.leave.emit(this.eventData);
  }

  editEvent() {
    this.edit.emit(this.eventData);
  }

  deleteEvent() {
    this.delete.emit(this.eventData);
  }

  toggleEdit() {
    this.optionsOpened = !this.optionsOpened;
    setTimeout(() => this.optionsOpened = !this.optionsOpened, 8000);
  }
}
