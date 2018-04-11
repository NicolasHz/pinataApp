import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public scrolled = false;

  constructor(
    private userService: UserService,
    public route: Router,
    @Inject(DOCUMENT) private doc: Document) { }

  ngOnInit() {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
     const isChrome = navigator.userAgent.indexOf('Chrome/') > -1;
     const isExplorer = navigator.userAgent.indexOf('Trident/') > -1;
     const bodyTop = this.doc.body.scrollTop;
     const toTop = this.doc.documentElement.scrollTop;

     if (isChrome || isExplorer) {
      if (toTop > 50) {
        this.scrolled = true;
      } else if (this.scrolled && toTop < 5) {
        this.scrolled = false;
      }
     } else {
      if ( bodyTop > 50 ) {
        this.scrolled = true;
      }else if (this.scrolled && bodyTop < 5) {
        this.scrolled = false;
     }
    }
  }

  logOutUser() {
    this.userService.logout();
    this.route.navigate(['login']);
  }
}
