import { User } from './../../interfaces/user';
import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public scrolled = false;
  private user: User;
  private userName;
  constructor(
    private userService: UserService,
    public route: Router,
    @Inject(DOCUMENT) private doc: Document,
    private util: UtilsService) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.userName = this.user.fullName.replace(/ .*/, '');
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
