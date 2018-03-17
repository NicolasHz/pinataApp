import { Evento, eventInitialState } from './../../interfaces/evento';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() eventData = eventInitialState;
  @Output() showActualImage = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }
  showImage() {
    this.showActualImage.emit();
  }
}
