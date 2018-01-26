import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';


// Components
import { HeaderComponent } from './header/header.component';

// Materialize
import {  MzNavbarModule,
          MzSidenavModule,
          MzIconModule,
          MzIconMdiModule } from 'ng2-materialize';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MzNavbarModule,
    MzSidenavModule,
    MzIconModule,
    MzIconMdiModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
      HeaderComponent
  ],
  exports: [
      HeaderComponent
  ]
})
export class SharedModule { }
