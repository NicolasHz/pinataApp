import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventRoutingModule } from './event-routing.module';

// Components
import { HeaderComponent } from '../../shared/header/header.component';
import { EventComponent } from './event.component';

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
    EventRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    EventComponent,
    HeaderComponent
]
})
export class EventModule { }
