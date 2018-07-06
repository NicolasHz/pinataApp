import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { HeaderComponent } from './header/header.component';
import { CardComponent } from './card/card.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { EventFormComponent } from '../modules/event/event-form/event-form.component';
import { BirhdayCardComponent } from './birthday-card/birhday-card/birhday-card.component';
import { FooterComponent } from './footer/footer/footer.component';
import { ConfettiComponent } from './confetti/confetti.component';

// Materialize
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';

// Services
import { MzInjectionService, MzValidationModule} from 'ngx-materialize';
import { EventsService } from '../services/events/events.service';
import { ModalService } from '../services/modal/modal.service';
import { UtilsService } from '../services/utils/utils.service';
import { GifsService } from '../services/gifs/gifs.service';
import { SplicePipe } from './splice/splice.pipe';
import { UploadImageService } from '../services/upload-image/upload-image.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MzValidationModule,
    ReactiveFormsModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    HeaderComponent,
    CardComponent,
    ConfirmModalComponent,
    BirhdayCardComponent,
    SplicePipe,
    EventFormComponent,
    FooterComponent,
    ConfettiComponent
  ],
  exports: [
    HeaderComponent,
    CardComponent,
    MaterialModule,
    ConfirmModalComponent,
    BirhdayCardComponent,
    EventFormComponent,
    ConfettiComponent
  ],
  providers: [
    EventsService,
    MzInjectionService,
    ModalService,
    UtilsService,
    GifsService,
    UploadImageService,
  ]
})
export class SharedModule { }
