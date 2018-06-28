import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import { GoogleApiService } from 'ng-gapi';
declare var WOW: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {
    // this.gapiService.onLoad().subscribe();
  }

  ngOnInit() {
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);

  });
    new WOW().init();
  }
}
