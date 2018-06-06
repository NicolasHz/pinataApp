import { trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { UserService } from './../../services/user/user.service';

@Component({
  selector: 'app-login',
  animations: [
    trigger('anim', [])
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  allow = true;
  login = false;
  isLoading = false;
  constructor( public userService: UserService ) { }

  logInUser() {
    this.isLoading = true;
    this.userService.login().then((allow) => {
      this.isLoading = allow;
      this.allow = allow;
    });
  }

  changeIcon() {
    this.login = !this.login;
  }
}
