import { User } from './../../interfaces/user';
import { Evento, eventInitialState } from './../../interfaces/evento';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MzToastService, MzModalService } from 'ng2-materialize';
import { EventsService } from '../../services/events.service';
import { UserService } from '../../services/user.service';
import { EventFormComponent } from '../../modules/event/event-form/event-form.component';
import { ConfirmModalComponent } from './../confirm-modal/confirm-modal.component';
import { ModalService } from '../../services/modal.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() eventData = eventInitialState;
  private actualImgReady = false;
  private optionsOpened = false;
  private eventAuthor = false;
  private preLoaderImg: string;
  private participants;
  private modalResponse: Subject<boolean>;
  private user: User;
  private joined = false; // test porpouses only, needs to be setted from User database
  private imgSource = [
    '../../assets/img/party.gif',
    '../../assets/img/party0.gif',
    '../../assets/img/party1.gif',
    '../../assets/img/party2.gif'];
  constructor(
    private toastService: MzToastService,
    private eventService: EventsService,
    private userService: UserService,
    private mzModalService: MzModalService,
    private modalService: ModalService) { }

  ngOnInit() {
    this.preLoaderImg = this.imgSource[Math.floor(Math.random() * this.imgSource.length)];
    this.user = this.userService.getUser();
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
    const eventData = this.eventData;
    const editingEvent = true;
    this.mzModalService.open(EventFormComponent, {eventData, editingEvent});
  }

  deleteEvent() {
    const eventData = this.eventData;
    const buttonText = {
      confirm: 'Delete',
      cancel: 'Cancel'
    };
    this.modalResponse = this.modalService.openModal(ConfirmModalComponent, {eventData, buttonText});
    this.modalResponse.subscribe(response => {
      if (response) {
        this.eventService.deleteEvent('events', this.eventData);
          this.toastService.show('Event Deleted!', 4000, 'green' );
      }else {
          this.toastService.show('Canceled', 4000, 'red' );
      }
    });
  }

  toggleEdit() {
    this.optionsOpened = !this.optionsOpened;
    setTimeout(() => this.optionsOpened = !this.optionsOpened, 8000);
  }
}
