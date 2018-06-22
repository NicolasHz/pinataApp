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

  getUser(googleUser): Observable<any> {
    return Observable.fromPromise(this.db.collection('users').doc(googleUser.uid).ref.get()
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
        console.log('dispatched')
        if (googleUser.metadata.creationTime !== googleUser.metadata.lastSignInTime && userData.isNewUser) {
          user.isNewUser = false;
        }
        return user;
      } else {
        // const newUser: User = {
        //   email: googleUser.email,
        //   fullName: googleUser.displayName,
        //   profilePicUrl: googleUser.photoURL,
        //   uId: googleUser.uid,
        //   isNewUser: googleUser.metadata.creationTime === googleUser.metadata.lastSignInTime,
        //   preferences: [],
        //   dateOfBirth: '',
        //   onBirthdayList: false,
        //   hasPayed: false,
        //   lastTimeSignedIn: googleUser.metadata.lastSignInTime,
        //   userSince: googleUser.metadata.creationTime,
        //   lastTimeModified: new Date().toISOString()
        // };
        // this.addUser(newUser).then(added => {
        //   if (added) {
        //     this.route.navigate(['my-account']);
        //   } else {
        //     console.log('error at save and load user');
        //   }
        // });
      }
    }).catch(error => {
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
