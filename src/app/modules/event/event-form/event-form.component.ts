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
  @Input() user: User;
  @Input() users: User[];
  @Input() calendarEvents;
  public modalOptions = MODAL_OPTIONS;
  public timepickerOptions = TIME_PICKER_OPTIONS;
  public startDatepickerOptions = START_DATE_PICKER_OPTIONS;
  public endDatepickerOptions = END_DATE_PICKER_OPTIONS;
  public errorMessageResources = ERROR_MESSAGES_RESOURCES;
  public cardGif;
  public firstSearch = false;
  public endDateAvalible = false;
  private event: Evento;
  public eventForm: FormGroup;
  public participantsChips: Materialize.ChipDataObject[];
  autocompleteOptions: Materialize.AutoCompleteOptions = {
    data: {},
    limit: 10,
    minLength: 2
  };

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
    if (this.users) {
      this.autocompleteOptions.data = this.users.reduce((acc, cur, i) => {
        acc[cur.fullName] = cur.profilePicUrl;
        return acc;
      }, {});
      this.editingEvent ? this.participantsChips = this.util.usersToChips(this.eventData.participants) : this.participantsChips = [];
    }
    if (this.editingEvent) {
      this.buildEditForm();
    } else {
      this.buildForm();
    }
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
      participants: [this.participantsChips],
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
      participants: [this.participantsChips],
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
      this.event = {
        id: this.eventData.id,
        title: this.eventForm.value.title,
        start: formattedStart,
        end: formattedEnd,
        createdTime: this.eventData.createdTime,
        lastEditedTime: new Date(),
        description: this.eventForm.value.description.trim(),
        image: this.eventForm.value.image,
        creator: this.user,
        participants: this.createParticipants()
      } as Evento;
      this.eventService.updateEvent('events', this.event);
      const calendarId = this.util.findCalendarEvent(this.event, this.calendarEvents).id;
      if (calendarId) {
        this.eventService.updateCalendarEvent(calendarId, this.event);
      }
      this.clear();
    } else {
      this.event = {
        title: this.eventForm.value.title,
        start: formattedStart,
        end: formattedEnd,
        createdTime: new Date(),
        description: this.eventForm.value.description,
        image: this.eventForm.value.image,
        creator: this.user,
        participants: this.createParticipants()
      } as Evento;
      if (this.event.participants.length > 0 && !this.util.findUser(this.event)) {
        this.event.participants.push(this.user);
        this.eventService.addEvent('events', this.event)
        .then( createdEvent => {
          this.event.id = createdEvent.id;
          this.eventService.addEventToCalendar(this.event)
            .then(success => {
              if (success) {
                this.toastService.show('Joined to event!', 4000, 'green');
              }
          });
        });
      } else {
        this.eventService.addEvent('events', this.event);
      }
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
    window.scrollTo(0, 0);
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

  triggerAdd(participant) {
    const user = this.users.find( x => x.fullName === participant.tag);
    // just to add an image ¯\_(ツ)_/¯
    const updatedParticipants = this.eventForm.value.participants.slice();
    updatedParticipants[updatedParticipants.findIndex( x => x.tag === participant.tag)] = {tag: participant.tag, image: user.profilePicUrl};
    this.eventForm.controls['participants'].setValue(updatedParticipants);
    this.participantsChips = this.eventForm.value.participants;
    // just to add an image ¯\_(ツ)_/¯
  }

  triggerDelete(participant) {
    const participantIndex = this.participantsChips.indexOf(participant);
    if (participantIndex > -1) {
      this.participantsChips.splice(participantIndex, 1);
    }
    this.participantsChips = this.participantsChips;
  }

  createParticipants() {
    const participants = [];
    if (this.eventForm.value.participants.length > 0) {
      this.eventForm.value.participants.map( participant => {
        participants.push(this.users.find(user => user.fullName === participant.tag));
      });
    }
    return participants;
  }

  existParticipant(participant) {
    return this.participantsChips.map(e => e.tag).indexOf(participant.tag);
  }
}
