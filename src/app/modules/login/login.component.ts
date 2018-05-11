import { Component } from '@angular/core';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  allow = true;
  constructor( private userService: UserService ) { }

  logUser() {
    this.userService.login().then((allow) => {
        this.allow = allow;
    });
  }
}
