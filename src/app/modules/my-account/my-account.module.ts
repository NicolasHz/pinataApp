import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MyAccountRoutingModule } from './my-account-routnig.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { MyAccountComponent } from './my-account.component';
import { ProfileComponent } from './profile/profile.component';
import { MyEventsComponent } from './my-events/my-events.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MyAccountRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    MyAccountComponent,
    ProfileComponent,
    MyEventsComponent
]
})
export class MyAccountModule { }
