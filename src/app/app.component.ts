import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GapiClientService } from './services/gapi-client/gapi-client.service';
declare var WOW: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private gapi: GapiClientService) {}

  ngOnInit() {
    this.gapi.initGAPIAuth();
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 1000);
  });
    new WOW().init();
  }
}
