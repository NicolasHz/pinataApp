import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';


// Components
import { HomeComponent } from './home.component';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from './../login/login.component';
import { BirthdayComponent } from '../birthday/birthday.component';
import { EventComponent } from '../event/event.component';

// Materialize
import {  MzNavbarModule,
          MzSidenavModule,
          MzIconModule,
          MzIconMdiModule } from 'ng2-materialize';

@NgModule({
  imports: [
    CommonModule,
    MzNavbarModule,
    MzSidenavModule,
    MzIconModule,
    MzIconMdiModule,
    HomeRoutingModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    BirthdayComponent,
    EventComponent
]
})
export class HomeModule { }
