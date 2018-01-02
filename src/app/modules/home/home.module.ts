import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';

// Modules
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Components
import { HomeComponent } from './home.component';
import { HeaderComponent } from '../header/header.component';
import { LoginComponent } from './../login/login.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MDBBootstrapModule.forRoot()
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    HomeComponent,
    HeaderComponent,
    LoginComponent
]
})
export class HomeModule { }
