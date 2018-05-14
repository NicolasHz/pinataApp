import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private user: UserService, private router: Router) { }

  ngOnInit() {
  }

  logOutUser() {
    this.user.logout();
    this.router.navigate(['/login']);
  }
}
