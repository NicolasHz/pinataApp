import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MzBaseModal } from 'ngx-materialize';

import { Evento } from './../../../interfaces/evento';
import { EventsService } from '../../../services/events/events.service';
import { MzToastService } from 'ngx-materialize';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-birthday-modal',
  templateUrl: './birthday-modal.component.html',
  styleUrls: ['./birthday-modal.component.scss']
})
export class BirthdayModalComponent extends MzBaseModal implements OnInit {
  public imageReady = false;
  public showSvg = false;
  public preferences = false;
  @Input() calEvent;
  @ViewChild('BirhtdayModal') birhtdayModal;

  public modalOptions: Materialize.ModalOptions = {
    startingTop: '100%', // Starting top style attribute
    endingTop: '0%', // Ending top style attribute
  };

  constructor(private eventService: EventsService, private toastService: MzToastService) {super(); }

  ngOnInit() {
    if (!this.calEvent) {
      return;
    }
    if (this.calEvent.image === '' || this.calEvent.image === null) {
      this.showSvg = true;
    }
    if (this.calEvent.preferences.length <= 0) {
      this.preferences = true;
    }
  }

  bookBirthday() {
    const eventData: Evento = this.calEvent;
    this.eventService.addEventToCalendar(eventData)
    .pipe(first())
    .subscribe(success => {
      this.birhtdayModal.closeModal();
      success ? this.toastService.show('Birthday booked successfully', 4000, 'green')
      : this.toastService.show('Failed at booking Birthday', 4000, 'red');
    });
  }
}
