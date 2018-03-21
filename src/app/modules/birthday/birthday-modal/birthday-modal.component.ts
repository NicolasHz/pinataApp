import { Component, OnInit, Input } from '@angular/core';
import { MzBaseModal, MzModalComponent } from 'ng2-materialize';

@Component({
  selector: 'app-birthday-modal',
  templateUrl: './birthday-modal.component.html',
  styleUrls: ['./birthday-modal.component.scss']
})
export class BirthdayModalComponent extends MzBaseModal implements OnInit {

  @Input() calEvent;
  constructor() {super(); }

  ngOnInit() {
console.log(this.calEvent.preferences);

  }

}
