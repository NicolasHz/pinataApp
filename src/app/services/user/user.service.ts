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

declare var gapi: any;
@Injectable()
export class UserService {
  public googleUser;
  constructor(
    private store: Store<fromRoot.State>,
    private db: AngularFirestore,
    public afAut: AngularFireAuth,
    private route: Router) {
    db.firestore.settings({ timestampsInSnapshots: true });
    this.afAut.authState.subscribe( googleUser => {
      if (!googleUser) {
        return;
      }
      this.googleUser = googleUser;
      this.fetchUser();
    });
  }

  addUser(user: User): Promise<boolean> {
    return this.db.collection('users').doc(user.uId).set(user)
    .then(() => {
        console.log( 'User successfully written!');
        this.store.dispatch(new UserActions.SetUser(user));
        return true;
    })
    .catch(error => {
        console.error('Error writing user: ', error);
        return false;
    });
  }

  fetchUser() {
    this.db.collection('users').doc(this.googleUser.uid).ref.get()
    .then(doc => {
      if (doc.exists) {
        const userData = doc.data();
        const user: User =  {
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
          userSince: userData.userSince,
          lastTimeModified: userData.lastTimeModified
        };
        this.store.dispatch(new UserActions.SetUser(user));
        if (this.googleUser.metadata.creationTime !== this.googleUser.metadata.lastSignInTime && userData.isNewUser) {
          user.isNewUser = false;
          this.store.dispatch(new UserActions.SetUser(user));
        }
      } else {
        const newUser: User = {
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
          userSince: this.googleUser.metadata.creationTime,
          lastTimeModified: new Date().toISOString()
        };
        this.addUser(newUser).then(added => {
          if (added) {
            this.route.navigate(['my-account']);
          } else {
            console.log('error at save and load user');
          }
        });
      }
    }).catch(error => {
        console.log('Error getting user:', error);
    });
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
          this.store.dispatch(new UserActions.SetUser(userInitialState));
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
