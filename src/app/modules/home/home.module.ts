import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';


// Components
import { HomeComponent } from './home.component';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from './../login/login.component';
import { CardComponent } from '../card/card.component';

// Materialize
import {  MzNavbarModule,
          MzSidenavModule,
          MzIconModule,
          MzIconMdiModule,
          MzCardModule  } from 'ng2-materialize';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MzNavbarModule,
    MzSidenavModule,
    MzIconModule,
    MzIconMdiModule,
    MzCardModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    CardComponent
]
})
export class HomeModule { }
