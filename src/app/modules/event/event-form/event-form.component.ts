import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Validators
import { IsEmptyValidator } from '../../../shared/validators/validators';
import {
  TIME_PICKER_OPTIONS,
  MODAL_OPTIONS,
  START_DATE_PICKER_OPTIONS,
  END_DATE_PICKER_OPTIONS,
  ERROR_MESSAGES_RESOURCES } from '../../../shared/options/date-time-pickers';

// Interfaces
import { User } from './../../../interfaces/user';
import { Evento } from './../../../interfaces/evento';
import * as moment from 'moment';

// Services
import {
  MzToastService,
  MzBaseModal} from 'ngx-materialize';
import { EventsService } from '../../../services/events/events.service';
import { UserService } from '../../../services/user/user.service';
import { GifsService } from '../../../services/gifs/gifs.service';
import { UtilsService } from '../../../services/utils/utils.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent extends MzBaseModal implements OnInit {

  @Input() editingEvent = false;
  @Input() eventData: Evento;
  public modalOptions = MODAL_OPTIONS;
  public timepickerOptions = TIME_PICKER_OPTIONS;
  public startDatepickerOptions = START_DATE_PICKER_OPTIONS;
  public endDatepickerOptions = END_DATE_PICKER_OPTIONS;
  public errorMessageResources = ERROR_MESSAGES_RESOURCES;
  public cardGif;
  public firstSearch = false;
  public endDateAvalible = false;
  private event: Evento;
  private user: User;
  public eventForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastService: MzToastService,
    private eventService: EventsService,
    private userService: UserService,
    private gifService: GifsService,
    private util: UtilsService
  ) { super(); }

  ngOnInit() {
    this.startDatepickerOptions.onOpen = () => this.endDateAvalible = false;
    this.startDatepickerOptions.onClose = () => this.setAvalibleEndDays();
    if (this.editingEvent) {
      this.buildEditForm();
    } else {
      this.buildForm();
    }
    this.user = this.userService.getUser();
  }

  buildForm() {
    this.eventForm = this.formBuilder.group({
      title: [null, Validators.required],
      start: this.formBuilder.group({
        eventStartDay : [null, Validators.required],
        eventStartHour: [null, Validators.required]
      }),
      end: this.formBuilder.group({
        eventEndDay : [null, Validators.required],
        eventEndHour: [null, Validators.required]
      }),
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(20),
          IsEmptyValidator
        ]
      ],
      image: [
        null
      ],
    });
  }

  buildEditForm() {
    this.endDateAvalible = true;
    const startDay = moment(this.eventData.start).format('YYYY-MM-DD');
    const startHour = moment(this.eventData.start).format('HH:mm');
    const endDay = moment(this.eventData.end).format('YYYY-MM-DD');
    const endHour = moment(this.eventData.end).format('HH:mm');
    this.eventForm = this.formBuilder.group({
      title: [this.eventData.title, Validators.required],
      start: this.formBuilder.group({
        eventStartDay : [startDay, Validators.required],
        eventStartHour: [startHour, Validators.required]
      }),
      end: this.formBuilder.group({
        eventEndDay : [endDay, Validators.required],
        eventEndHour: [endHour, Validators.required]
      }),
      description: [
        this.eventData.description,
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(20)
        ]
      ],
      image: [
        this.eventData.image
      ],
    });
  }

  clear() {
    this.eventForm.reset();
  }

  submitForm() {
    const formattedStart = moment(this.eventForm.value.start.eventStartDay + 'T' + this.eventForm.value.start.eventStartHour).format();
    const formattedEnd = moment(this.eventForm.value.end.eventEndDay + 'T' + this.eventForm.value.end.eventEndHour).format();
    if (this.editingEvent) {
      this.event = <Evento>{
        id: this.eventData.id,
        title: this.eventForm.value.title,
        start: formattedStart,
        end: formattedEnd,
        createdTime: this.eventData.createdTime,
        lastEditedTime: new Date(),
        description: this.eventForm.value.description.trim(),
        image: this.eventForm.value.image,
        creator: this.user,
        participants: this.eventData.participants
      };
      this.eventService.updateEvent('events', this.event);
      this.eventService.updateCalendarEvent(this.util.findCalendarEvent(this.event, this.eventService.calendarEvents).id, this.event);
      this.clear();
    } else {
      this.event = <Evento>{
        title: this.eventForm.value.title,
        start: formattedStart,
        end: formattedEnd,
        createdTime: new Date(),
        description: this.eventForm.value.description,
        image: this.eventForm.value.image,
        creator: this.user,
        participants: []
      };
      this.eventService.addEvent('events', this.event);
      this.clear();
    }
  }

  getGif(q) {
    this.cardGif = this.gifService.getGif(q);
    this.firstSearch = true;
  }

  setCardImg(imgUrl) {
    if (!imgUrl) {
      return;
    }
    this.eventForm.controls['image'].setValue(imgUrl);
  }

  showToast(message: string, color: string) {
    this.toastService.show(message, 4000, color );
  }

  setAvalibleEndDays() {
    if (this.eventForm.value.start.eventStartDay) {
      const minDate = this.eventForm.value.start.eventStartDay.split('-').map(Number);
      minDate[1]--; // Discounting a month because of the date picker restriction behavior
      this.endDatepickerOptions.min = minDate;
      this.eventForm.value.end.eventEndDay = this.eventForm.value.start.eventStartDay;
      this.endDateAvalible = true;
    } else {
      this.endDateAvalible = false;
    }
  }
}
