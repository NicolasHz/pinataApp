import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';


// Components
import { HeaderComponent } from './header/header.component';
import { CardComponent } from './card/card.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

// Materialize
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';

// Services
import { MzInjectionService} from 'ng2-materialize';
import { EventsService } from '../services/events.service';
import { ModalService } from '../services/modal.service';
import { UtilsService } from '../services/utils.service';

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
    ModalService,
    UtilsService
  ]
})
export class SharedModule { }
