import { Evento, eventInitialState } from './../../interfaces/evento';
import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() eventData = eventInitialState;
  imageReady = false;
  partyImg: string;
  imgSource = [
    '../../assets/img/party.gif',
    '../../assets/img/party0.gif',
    '../../assets/img/party1.gif',
    '../../assets/img/party2.gif'];
  constructor() { }

  ngOnInit() {
    this.partyImg = this.imgSource[Math.floor(Math.random() * this.imgSource.length)];
  }
  showImage() {
    this.imageReady = true;
  }
}
