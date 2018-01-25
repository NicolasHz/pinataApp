import { RoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import { environment } from '../environments/environment';

// Services
import { LoginService } from './services/login.service';
import { AuthGuardService } from './services/auth-guard.service';
import { NotFoundComponent } from './modules/not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    RoutingModule,
  ],
  providers: [
    LoginService,
    AngularFireAuth,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
