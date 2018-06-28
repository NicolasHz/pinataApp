import { Router } from '@angular/router';
import { User } from './../../interfaces/user';
import { userInitialState } from './../../interfaces/user-initial-state';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as UserActions from '../../actions/user/user.actions';
import { Observable } from 'rxjs';

declare var gapi: any;
@Injectable()
export class UserService {
  constructor(
    private store: Store<fromRoot.State>,
    public afAut: AngularFireAuth,
    private db: AngularFirestore,
    private route: Router) {
    db.firestore.settings({ timestampsInSnapshots: true });
  }

  addUser(user: User): Observable<any> {
    return Observable.fromPromise(this.db.collection('users').doc(user.uId).set(user)
    .catch(error => {
        console.error('Error writing user: ', error);
    }));
  }

  getUser(googleUser): Observable<any> {
    return Observable.fromPromise(this.db.collection('users').doc(googleUser.uid).ref.get()
    .catch(error => {
        console.log('Error getting user:', error);
    }));
  }

  login(): Promise<boolean> {
    return gapi.auth2.getAuthInstance().signIn({prompt: 'select_account'})
    .then(googleUser => {
      const credential = firebase.auth.GoogleAuthProvider
        .credential(googleUser.getAuthResponse().id_token);
      firebase.auth().signInWithCredential(credential).then(() => this.route.navigate(['home']));   // Sign in with credential from the Google user.
      return gapi.auth2;
    })
    .catch(() => false);
  }

  logout(): Promise<boolean> {
    return gapi.auth2.getAuthInstance().signOut()
      .then(() => {
        return this.afAut.auth.signOut()
        .then(() => {
          this.store.dispatch(new UserActions.GetUserSuccess(userInitialState));
          return true;
      })
      .catch(() => false);
    });
  }

  getUsers() {
    return this.db
    .collection('users')
    .snapshotChanges()
    .map(docArray => {
      return docArray.map(doc => {
        return doc.payload.doc.data();
      });
    });
  }
}
