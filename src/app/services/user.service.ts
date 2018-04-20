import { Router } from '@angular/router';
import { User } from './../interfaces/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
declare var gapi: any;
@Injectable()
export class UserService {
  private user: User;
  constructor(
    public afAut: AngularFireAuth,
    private route: Router) {

    this.afAut.authState.subscribe( user => {
      if (!user) {
        return;
      }
      this.user = {
        email: 'nose',
        fullName: user.displayName,
        profilePicUrl: user.photoURL,
        uId: user.uid
      };
      this.route.navigate(['home']);
    });
    gapi.load('client:auth2', this.initClient);
  }

  login() {
    this.afAut.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(
      error => console.log(error)
    );
  }

  logout() {
    this.afAut.auth.signOut().catch(
      error => console.log(error)
    );
    this.user = {
      email: '',
      fullName: '',
      profilePicUrl: '',
      uId: ''
    };
  }
  getUser() {
    return this.user;
  }

  // Calendar interaction
  initClient(): Promise<[{}]> {
    return gapi.client.init({
      apiKey: 'AIzaSyDGIy92a4JYf_3TksdWwGdwhaMxx3W7SrQ',
      clientId: '289697189757-l3muf4hpsin6f3dnt73ka1jvh1ckvnd9.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar'
    });
  }
}
