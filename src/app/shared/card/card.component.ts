import { Evento, eventInitialState } from './../../interfaces/evento';
import { Component, OnInit, Input} from '@angular/core';
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() eventData = eventInitialState;
  actualImgReady = false;
  preLoaderImg: string;
  participants;
  joined = false; // test porpouses only, needs to be setted from User database
  imgSource = [
    '../../assets/img/party.gif',
    '../../assets/img/party0.gif',
    '../../assets/img/party1.gif',
    '../../assets/img/party2.gif'];
  constructor(private toastService: MzToastService) { }

  ngOnInit() {
    this.preLoaderImg = this.imgSource[Math.floor(Math.random() * this.imgSource.length)];

    if (this.eventData.participants) {
      this.participants = this.eventData.participants.length;
    }else {
      this.participants = 0;
    }
  }

  showImage() {
    this.actualImgReady = true;
  }

  showToast() {
    if (this.joined) {
      this.toastService.show('Joined to event!', 4000, 'green');
    }else {
      this.toastService.show('Event leaved!', 4000, 'red');
    }
  }

  joinEvent() {
    this.joined = true; // test porpouses only, needs to be setted from User database
    this.participants++; // test porpouses only, needs to be setted from User database
  }

  leaveEvent() {
    this.joined = false; // test porpouses only, needs to be setted from User database
    this.participants--; // test porpouses only, needs to be setted from User database
  }
}
