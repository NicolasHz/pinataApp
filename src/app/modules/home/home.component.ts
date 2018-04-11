import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  name: string;
  constructor( private _loginService: UserService ) { }

  ngOnInit() {
    this.name = this._loginService.afAut.auth.currentUser.displayName;
  }
}
