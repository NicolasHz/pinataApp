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
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ModalService } from '../services/modal.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
      HeaderComponent,
      CardComponent,
      ConfirmModalComponent
  ],
  exports: [
      HeaderComponent,
      CardComponent,
      MaterialModule
  ],
  providers: [
    EventsService,
    MzInjectionService,
    ModalService
  ]
})
export class SharedModule { }
