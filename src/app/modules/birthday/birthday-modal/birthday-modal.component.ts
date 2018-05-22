import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MzBaseModal } from 'ng2-materialize';

import { Evento } from './../../../interfaces/evento';
import { EventsService } from '../../../services/events/events.service';
import { MzToastService } from 'ng2-materialize';
import * as moment from 'moment';
@Component({
  selector: 'app-birthday-modal',
  templateUrl: './birthday-modal.component.html',
  styleUrls: ['./birthday-modal.component.scss']
})
export class BirthdayModalComponent extends MzBaseModal {
  imageReady = false;
  @Input() calEvent;
  @ViewChild('BirhtdayModal') birhtdayModal;

  public modalOptions: Materialize.ModalOptions = {
    startingTop: '100%', // Starting top style attribute
    endingTop: '0%', // Ending top style attribute
  };

  constructor(private eventService: EventsService, private toastService: MzToastService) {super(); }

  bookBirthday() {
    const eventData: Evento = this.calEvent;
    this.eventService.addEventToCalendar(eventData)
    .then((success) => {
      this.birhtdayModal.close();
      success ? this.toastService.show('Birthday booked successfully', 4000, 'green')
      : this.toastService.show('Failed at booking Birthday', 4000, 'red');
    });
  }

  showImage() {
    this.imageReady = true;
  }
}
