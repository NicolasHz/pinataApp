import { Injectable } from '@angular/core';
import { MzModalService } from 'ngx-materialize';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ModalService {
  public modalResponse: Subject<boolean> = new Subject;
  constructor(private modalService: MzModalService) { }

  openModal(modalComponent, {eventData, buttonText}) {
    this.modalService.open(modalComponent, {eventData, buttonText});
    return this.modalResponse;
  }
}
