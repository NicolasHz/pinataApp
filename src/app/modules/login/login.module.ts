import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';


// Components

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
    MzIconMdiModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: []
})
export class LoginModule { }