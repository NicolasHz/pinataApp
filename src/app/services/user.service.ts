import { Router } from '@angular/router';
import { User } from './../interfaces/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

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
        fullName: user.displayName,
        profilePicUrl: user.photoURL,
        uId: user.uid
      };
      this.route.navigate(['home']);
    });
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
      fullName: '',
      profilePicUrl: '',
      uId: ''
    };
  }
  getUser() {
    return this.user;
  }
}
