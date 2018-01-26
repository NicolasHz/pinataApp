import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MyAccountRoutingModule } from './my-account-routnig.module';

// Components
import { MyAccountComponent } from './my-account.component';
import { HeaderComponent } from '../../shared/header/header.component';

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
    MyAccountRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    MyAccountComponent,
    HeaderComponent
]
})
export class MyAccountModule { }
