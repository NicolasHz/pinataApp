import { Component, Input, OnInit } from '@angular/core';
import { SimpleModal } from '../../interfaces/simple-modal';

@Component({
  selector: 'app-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['./simple-modal.component.scss']
})
export class SimpleModalComponent implements OnInit {
  @Input() modalData: SimpleModal = {title: 'Title', message: 'Title'};
  constructor() {}

  ngOnInit() {
  }
}
