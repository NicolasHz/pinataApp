import { MzToastService } from 'ngx-materialize';
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
import { UserService } from './services/user/user.service';
import { AuthGuardService } from './services/auth-guard/auth-guard';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as effects from './effects';

import {
  GoogleApiModule,
  // GoogleApiService,
  // GoogleAuthService,
  NgGapiClientConfig,
  NG_GAPI_CONFIG,
  // GoogleApiConfig
} from 'ng-gapi';

const gapiClientConfig: NgGapiClientConfig = {
  client_id : '289697189757-l3muf4hpsin6f3dnt73ka1jvh1ckvnd9.apps.googleusercontent.com',
  discoveryDocs : ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope : 'https://www.googleapis.com/auth/calendar'
};
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    RoutingModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 5
    }),
    EffectsModule.forRoot(effects.effects)
  ],
  providers: [
    MzToastService,
    UserService,
    AngularFireAuth,
    AuthGuardService,
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
