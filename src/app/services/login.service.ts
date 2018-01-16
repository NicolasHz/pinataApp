import { User } from './../interfaces/user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class LoginService {

  public user: any = {}; // Crear interfaz de usuario y pasarle el tipo a la variable

  constructor(public afAut: AngularFireAuth) {

    this.afAut.authState.subscribe( user => {
      if (!user) {
        return;
      }
      this.user = user;
    });
  }

  login() {
    this.afAut.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(
      error => console.log(error)
    );
    console.log('Usuario: ', this.user);
  }

  logout() {
    this.afAut.auth.signOut().catch(
      error => console.log(error)
    );
    this.user = {};

    console.log(this.user);
  }
}