import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BirthdayRoutingModule } from './birthday-routing.module';

// Components
import { HeaderComponent } from '../../shared/header/header.component';
import { BirthdayComponent } from './birthday.component';

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
    BirthdayRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    BirthdayComponent
  ]
})
export class BirthdayModule { }
