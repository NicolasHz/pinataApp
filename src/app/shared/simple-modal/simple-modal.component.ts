import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SimpleModal } from '../../interfaces/simple-modal';

@Component({
  selector: 'app-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['./simple-modal.component.scss']
})
export class SimpleModalComponent implements AfterViewInit {
  @Input() modalData: SimpleModal = { title: 'Title', message: 'Title' };
  @Output() close = new EventEmitter<boolean>();
  @ViewChild('userImage') image: ElementRef;
  closeModal: boolean;
  imageReady: boolean;
  constructor() {
    this.closeModal = false;
    this.imageReady = false;
  }

  ngAfterViewInit() {
    this.image.nativeElement.onload = () => {
      this.imageReady = true;
    };
  }

  modalClose() {
    this.closeModal = true;
    setTimeout(() => {
      this.close.emit(true);
    }, 2000);
  }
}
