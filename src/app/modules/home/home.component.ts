import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  name: string;
  constructor( private userService: UserService ) { }

  ngOnInit() {
    this.name = this.userService.afAut.auth.currentUser.displayName;
  }
}
