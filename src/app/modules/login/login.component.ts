import { Component } from '@angular/core';
import { LoginService } from './../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor( private _loginService: LoginService) { }

  logUser() {
    console.log('Has ingresado!');
    this._loginService.login();

  }

  logOutUser() {
    this._loginService.logout();
  }
}
