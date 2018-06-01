import { Router } from '@angular/router';
import { User, userInitialState } from './../../interfaces/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFirestore } from 'angularfire2/firestore';

declare var gapi: any;
@Injectable()
export class UserService {
  private API_KEY = 'AIzaSyDGIy92a4JYf_3TksdWwGdwhaMxx3W7SrQ';
  private CLIENT_ID = '289697189757-l3muf4hpsin6f3dnt73ka1jvh1ckvnd9.apps.googleusercontent.com';
  private DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  private SCOPE = 'https://www.googleapis.com/auth/calendar';
  private user: BehaviorSubject<User> = new BehaviorSubject<User>(userInitialState);
  public calendarApiClient;
  public googleUser;
  constructor(
    private db: AngularFirestore,
    public afAut: AngularFireAuth,
    private route: Router) {

    this.afAut.authState.subscribe( googleUser => {
      if (!googleUser) {
        return;
      }
      this.googleUser = googleUser;
      this.fetchUser();
    });
    gapi.load('client:auth2', this.initClient);
  }

  addUser(user: User) {
    this.db.collection('users').doc(user.uId).set(user)
    .then(() => {
        console.log( 'User successfully written!');
    })
    .catch((error) => {
        console.error('Error writing user: ', error);
    });
  }

  fetchUser() {
    this.db.collection('users').doc(this.googleUser.uid).ref.get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const user =  {
          email: userData.email,
          fullName: userData.fullName,
          profilePicUrl: userData.profilePicUrl,
          uId: userData.uId,
          isNewUser: userData.isNewUser,
          preferences: userData.preferences,
          dateOfBirth: userData.dateOfBirth,
          onBirthdayList: userData.onBirthdayList,
          hasPayed: userData.hasPayed,
          lastTimeSignedIn: userData.lastTimeSignedIn,
          userSince: userData.userSince
        };
        this.user.next(user);
        if (this.googleUser.metadata.creationTime !== this.googleUser.metadata.lastSignInTime && userData.isNewUser) {
          user.isNewUser = false;
          this.addUser(user);
        }
        this.route.navigate(['home']);
      } else {
        const newUser = {
          email: this.googleUser.email,
          fullName: this.googleUser.displayName,
          profilePicUrl: this.googleUser.photoURL,
          uId: this.googleUser.uid,
          isNewUser: this.googleUser.metadata.creationTime === this.googleUser.metadata.lastSignInTime,
          preferences: [],
          dateOfBirth: '',
          onBirthdayList: false,
          hasPayed: false,
          lastTimeSignedIn: this.googleUser.metadata.lastSignInTime,
          userSince: this.googleUser.metadata.creationTime
        };
        this.addUser(newUser);
        this.user.next(newUser);
        this.route.navigate(['my-account']);
      }
    }).catch((error) => {
        console.log('Error getting user:', error);
    });
  }

  login(): Promise<boolean> {
    return gapi.auth2.getAuthInstance().signIn({prompt: 'select_account'})
    .then((googleUser) => {
      const credential = firebase.auth.GoogleAuthProvider
        .credential(googleUser.getAuthResponse().id_token);
      firebase.auth().signInWithCredential(credential);     // Sign in with credential from the Google user.
      return gapi.auth2;
    })
    .catch(() => false);
  }

  logout(): Promise<boolean> {
    return gapi.auth2.getAuthInstance().signOut()
      .then(() => {
        return this.afAut.auth.signOut()
        .then(() => {
          this.user.next(userInitialState);
        return true;
      })
      .catch(
        error => false
      );
    });
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

