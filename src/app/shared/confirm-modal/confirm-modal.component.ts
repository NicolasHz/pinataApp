import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @Input() eventData;
  @Input() buttonText = {
      confirm: 'Confirm',
      cancel: 'Cancel'
    };
  @Output() response: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('ConfirmModal') confirmModal;
  constructor() { }

  ngOnInit() { }

  confirm() {
    this.response.emit(true);
  }

  cancel() {
    this.response.emit(false);
  }
}
