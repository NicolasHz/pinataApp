import { Router } from '@angular/router';
import { User } from './../../interfaces/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

declare var gapi: any;
@Injectable()
export class UserService {
  private API_KEY = 'AIzaSyDGIy92a4JYf_3TksdWwGdwhaMxx3W7SrQ';
  private CLIENT_ID = '289697189757-l3muf4hpsin6f3dnt73ka1jvh1ckvnd9.apps.googleusercontent.com';
  private DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  private SCOPE = 'https://www.googleapis.com/auth/calendar';
  private user: User;
  public calendarApiClient;

  constructor(
    public afAut: AngularFireAuth,
    private route: Router) {

    this.afAut.authState.subscribe( user => {
      if (!user) {
        return;
      }
      this.user = {
        email: user.email,
        fullName: user.displayName,
        profilePicUrl: user.photoURL,
        uId: user.uid,
        isNewUser: false
      };
      this.route.navigate(['home']);
    });
    gapi.load('client:auth2', this.initClient);
  }

  login(): Promise<boolean> {
    return gapi.auth2.getAuthInstance().signIn()
    .then((googleUser) => {
      const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
        const credential = firebase.auth.GoogleAuthProvider
        .credential(googleUser.getAuthResponse().id_token);
        if (firebaseUser) {
          this.user.isNewUser = firebaseUser.metadata.creationTime === firebaseUser.metadata.lastSignInTime;
        }
        // Sign in with credential from the Google user.
        return firebase.auth().signInWithCredential(credential);
      });
      return true;
    })
    .catch(() => false);
  }

  logout(): Promise<boolean> {
    return this.afAut.auth.signOut()
      .then(() => {
        this.user = {
          email: '',
          fullName: '',
          profilePicUrl: '',
          uId: ''
        };
        return true;
      })
      .catch(
        error => false
      );
  }

  getUser() {
    return this.user;
  }

  // Calendar interaction
  initClient = (): Promise<any> => {
    return gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPE
    }).then(() => {
      this.calendarApiClient = gapi.auth2.getAuthInstance();
    })
    .catch(() => console.log('Something Wrong with calendar Api'));
  }

  getCalendarApi(): Promise<any> {
    return this.calendarApiClient;
  }
}



  // Saved method in case of rollback
  // logIn() {
  //   const firebaseInit = new firebase.auth.GoogleAuthProvider();
  //   firebaseInit.addScope('https://www.googleapis.com/auth/calendar');
  //   firebaseInit.setCustomParameters({
  //     apiKey: this.API_KEY,
  //     clientId: this.CLIENT_ID,
  //     discoveryDocs: this.DISCOVERY_DOCS
  //   });
  //   this.afAut.auth.signInWithPopup(firebaseInit)
  //   .then((response) => {console.log(response.additionalUserInfo.isNewUser)})
  //   .catch(
  //     error => console.log(error)
  //   );
  // }
