import { User } from './../../interfaces/user';
import { Evento, eventInitialState } from './../../interfaces/evento';
import { Component, OnInit, Input} from '@angular/core';
import { MzToastService, MzModalService } from 'ng2-materialize';
import { EventsService } from '../../services/events.service';
import { UserService } from '../../services/user.service';
import { EventFormComponent } from '../../modules/event/event-form/event-form.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() eventData = eventInitialState;
  actualImgReady = false;
  preLoaderImg: string;
  eventAuthor = false;
  participants;
  user: User;
  joined = false; // test porpouses only, needs to be setted from User database
  imgSource = [
    '../../assets/img/party.gif',
    '../../assets/img/party0.gif',
    '../../assets/img/party1.gif',
    '../../assets/img/party2.gif'];
  constructor(
    private toastService: MzToastService,
    private eventService: EventsService,
    private userService: UserService,
    private modalService: MzModalService) { }

  ngOnInit() {
    this.preLoaderImg = this.imgSource[Math.floor(Math.random() * this.imgSource.length)];
    this.user = this.userService.getUser();
    console.log( this.eventData.creator, this.user.uId)
    this.eventAuthor = this.eventData.creator === this.user.uId ? true : false;
    if (this.eventData.participants) {
      this.participants = this.eventData.participants.length;
      if (this.findUser()) {
        this.joined = true;
      }
    }else {
      this.participants = 0;
    }
  }

  showImage() {
    this.actualImgReady = true;
  }

  findUser() {
    return this.eventData.participants.find( o => o.uId === this.user.uId);
  }

  showToast() {
    if (this.joined) {
      this.toastService.show('Event leaved!', 4000, 'red');
    }else {
      this.toastService.show('Joined to event!', 4000, 'green');
    }
  }

  joinEvent() {
    this.eventData.participants.push(this.user);
    this.eventService.updateEvent('events', this.eventData);
  }

  leaveEvent() {
    const index = this.eventData.participants.indexOf(this.findUser());
    this.eventData.participants.splice(index);
    this.eventService.updateEvent('events', this.eventData);
  }

  editEvent() {
    this.modalService.open(EventFormComponent);
  }

  deleteEvent() {

  }
}
