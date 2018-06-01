import { Observable } from 'rxjs/Observable';
import { User } from './../../interfaces/user';
import { Router } from '@angular/router';
import { UserService } from './../../services/user/user.service';
import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { UtilsService } from '../../services/utils/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public scrolled = false;
  public user;
  public userName = 'a';
  constructor(
    private userService: UserService,
    public route: Router,
    @Inject(DOCUMENT) private doc: Document,
    private util: UtilsService) { }

  ngOnInit() {
    this.user = this.userService.getUser()
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = this.util.scrolled(this.doc);
  }

  logOutUser() {
    this.userService.logout();
    this.route.navigate(['login']);
  }
}
