import { Component, OnInit } from '@angular/core';
import { AbstractControl,
    FormBuilder,
    FormGroup,
    Validators } from '@angular/forms';
import { MzToastService, MzBaseModal, MzModalComponent } from 'ng2-materialize';
import { EventsService } from '../../../services/events.service';
import { TIME_PICKER_OPTIONS,
    MODAL_OPTIONS,
    START_DATE_PICKER_OPTIONS,
    END_DATE_PICKER_OPTIONS } from '../../../shared/options/date-time-pickers';
    import { User } from './../../../interfaces/user';
import { Evento } from './../../../interfaces/evento';
import * as moment from 'moment';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent extends MzBaseModal implements OnInit {

  errorMessageResources = {
    title: {
      required: 'Title is required.',
    },
    startDate: {
      required: 'Start date is required.',
    },
    endDate: {
      required: 'Start date is required.',
    },
    startHour: {
      required: 'Start hour is required.',
    },
    endHour: {
      required: 'Start hour is required.',
    },
    description: {
      required: 'You need a description for this event.',
      minlength: 'Min lenght 25 characters',
      maxlength: 'Description cannot be more than 255 characters long.'
    },
  };
  public modalOptions = MODAL_OPTIONS;
  public timepickerOptions = TIME_PICKER_OPTIONS;
  public startDatepickerOptions = START_DATE_PICKER_OPTIONS;
  public endDatepickerOptions = END_DATE_PICKER_OPTIONS;
  public endDateAvalible = false;
  private event: Evento;
  private user: User;
  eventForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private toastService: MzToastService,
    private eventService: EventsService,
    private userService: UserService
  ) { super(); }

  ngOnInit() {
    this.startDatepickerOptions.onOpen = () => this.endDateAvalible = false;
    this.startDatepickerOptions.onClose = () => this.setAvalibleDays();
    this.buildForm();
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
          Validators.minLength(20)
        ]
      ],
      image: [null],
    });
  }

  clear() {
    this.eventForm.reset();
  }

  submitForm() {
    const formattedStart = moment(this.eventForm.value.start.eventStartDay + 'T' + this.eventForm.value.start.eventStartHour).format();
    const formattedEnd = moment(this.eventForm.value.end.eventEndDay + 'T' + this.eventForm.value.end.eventEndHour).format();
    this.event = <Evento>{
      title: this.eventForm.value.title,
      start: formattedStart,
      end: formattedEnd,
      description: this.eventForm.value.description,
      image: '',
      creator: this.user.uId
    };
    this.eventService.addEvent('events', this.event);
    this.clear();
  }

  showToast(message: string, color: string) {
    this.toastService.show(message, 4000, color );
  }
  setAvalibleDays() {
    if (this.eventForm.value.start.eventStartDay) {
      const minDate = this.eventForm.value.start.eventStartDay.split('-').map(Number);
      minDate[1]--; // Discounting a month because of the date picker restriction behavior
      this.endDatepickerOptions.min = minDate;
      this.endDateAvalible = true;
    } else {
      this.endDateAvalible = false;
    }
  }
}
