import { trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { UserService } from './../../services/user/user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  animations: [
    trigger('anim', [])
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  popUpClosed = 'popup_closed_by_user';
  accessDenied = 'access_denied';
  allow = true;
  login = false;
  isLoading = false;
  constructor( public userService: UserService ) { }

  logInUser() {
    this.isLoading = true;
    this.userService.login().pipe(first()).subscribe(response => {

      switch (response) {
        case this.popUpClosed: {
          this.isLoading = false;
          break;
        }
        case this.accessDenied: {
          this.isLoading = false;
          this.allow = false;
          break;
        }
        case true: {
          this.isLoading = true;
          this.allow = true;
          break;
        }
        default:
          break;
      }
    });
  }

  changeIcon() {
    this.login = !this.login;
  }
}
