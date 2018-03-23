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

  submitted = false;
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastService: MzToastService,
    private eventService: EventsService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.userForm = this.formBuilder.group({
      title: [null, Validators.required],
      eventStartTime: [null, Validators.required],
      eventEndTime: [null, Validators.required],
      description: [null,
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

  clear() {
    this.userForm.reset();
  }

  onSubmit() {
    this.submitted = true;
    // this.user = Object.assign({}, this.userForm.value);
  }

  showToast(message: string, color: string) {
    this.toastService.show(message, 4000, color );
  }
}
