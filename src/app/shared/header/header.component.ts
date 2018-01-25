import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private _loginService: LoginService,
              public route: Router) { }

  ngOnInit() {
  }

  logOutUser() {
    this._loginService.logout();
    this.route.navigate(['login']);
  }

}
