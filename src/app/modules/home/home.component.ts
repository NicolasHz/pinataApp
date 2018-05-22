import { Component, OnInit } from '@angular/core';

// Services
import { UserService } from './../../services/user/user.service';
import { EventsService } from '../../services/events/events.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  name: string;
  constructor(
    private userService: UserService,
    private eventService: EventsService ) { }

  ngOnInit() {
    console.log(this.eventService.calendarEvents)
    this.name = this.userService.afAut.auth.currentUser.displayName;
  }
}
