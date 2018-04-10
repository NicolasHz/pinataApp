import { Evento } from './../../../interfaces/evento';
import { Component, OnInit, Renderer } from '@angular/core';
import { AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    Validators } from '@angular/forms';
import { MzToastService } from 'ng2-materialize';
import { EventsService } from '../../../services/events.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

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

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .2, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '0%', // Ending top style attribute
  };
  public timepickerOptions: Pickadate.TimeOptions = {
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Clear', // text for clear-button
    canceltext: 'Cancel', // Text for cancel-button
    autoclose: true, // automatic close timepicker
    ampmclickable: false, // make AM PM clickable
  };
  private event: Evento;
  submitted = false;
  eventForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private toastService: MzToastService,
    private eventService: EventsService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.eventForm = this.formBuilder.group({
      title: [null, Validators.required],
      start: [null, Validators.required],
      end: [null, Validators.required],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(20)
        ]
      ],
      eventStartHour: [null, Validators.required],
      eventEndHour: [null, Validators.required]
    });
  }
  // buildForm() {
  //   this.eventForm = this.formBuilder.group({
  //     title: [null, Validators.required],
  //     start: [null, Validators.required],
  //     end: [null, Validators.required],
  //     description: [
  //       null,
  //       [
  //         Validators.required,
  //         Validators.maxLength(255),
  //         Validators.minLength(20)
  //       ]
  //     ],
  //     eventStartHour: [null, Validators.required],
  //     eventEndHour: [null, Validators.required]
  //   });
  // }

  clear() {
    this.eventForm.reset();
  }

  submitForm() {
    this.submitted = true;
    const model = <Evento>this.eventForm.value;
    console.log(model)
    // this.eventService.addEvent('events', this.eventForm.value);
    // this.clear();
    // this.user = Object.assign({}, this.userForm.value);
  }

  showToast(message: string, color: string) {
    this.toastService.show(message, 4000, color );
  }
}
