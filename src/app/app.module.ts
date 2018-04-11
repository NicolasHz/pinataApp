import { RoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { environment } from '../environments/environment';

// Services
import { UserService } from './services/user.service';
import { AuthGuardService } from './services/auth-guard';
import { NotFoundComponent } from './modules/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    RoutingModule,
    HttpClientModule
  ],
  providers: [
    UserService,
    AngularFireAuth,
    AuthGuardService,
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
