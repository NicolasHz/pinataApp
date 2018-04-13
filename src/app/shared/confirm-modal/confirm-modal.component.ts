import { Evento } from './../../interfaces/evento';
import { Component, OnInit, Input } from '@angular/core';
import { MzBaseModal, MzModalComponent } from 'ng2-materialize';
import { Subject } from 'rxjs/Subject';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent extends MzBaseModal implements OnInit {
  @Input() eventData: Evento;
  @Input() buttonText: Evento;
  constructor(private modalService: ModalService ) { super(); }

  ngOnInit() { }

  confirm() {
    this.modalService.modalResponse.next(true);
  }

  cancel() {
    this.modalService.modalResponse.next(false);
  }
}
