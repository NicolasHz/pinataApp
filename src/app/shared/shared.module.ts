import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';


// Components
import { HeaderComponent } from './header/header.component';

// Materialize
import { MzInjectionService} from 'ng2-materialize';
import { RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';
import { MaterialModule } from './material.module';
import { EventsService } from '../services/events.service';
import { UserService } from '../services/user.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
      HeaderComponent,
      CardComponent
  ],
  exports: [
      HeaderComponent,
      CardComponent,
      MaterialModule
  ],
  providers: [
    EventsService,
    UserService,
    MzInjectionService
  ]
})
export class SharedModule { }
