import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';
import { trigger } from '@angular/animations';

import { eventInitialState } from './../../interfaces/evento-initial-state';
import { Evento } from '../../interfaces/evento';

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
  @Input() enableEdit = false;
  @Input() disableButton = false;
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
    participantsTooltip = 'Join and be the first!';

  constructor(private util: UtilsService) { }

  ngOnInit() {
    this.preLoaderImg = this.imgSource[Math.floor(Math.random() * this.imgSource.length)];
    this.eventAuthor = this.util.isEventCreator(this.eventData);
    this.participants = this.eventData.participants.length;
    if (this.util.findCurrentUser(this.eventData)) {
      this.joined = true;
    }
    if (this.eventData.participants.length > 0) {
      this.participantsTooltip = '';
      this.eventData.participants.map(res => {
        const avatar = res.profilePicUrl ? res.profilePicUrl : '';
        this.participantsTooltip = this.participantsTooltip + `<img class="tooltip-image" src="${avatar}"/>  ` + res.fullName.concat('<br/>');
      });
    }
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
