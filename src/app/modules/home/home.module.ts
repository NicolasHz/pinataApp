import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';


// Components
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    HomeComponent
]
})
export class HomeModule { }
