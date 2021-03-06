import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// Interfaces
import { userInitialState } from './../../interfaces/user-initial-state';
import { User } from './../../interfaces/user';

// NgRx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as UserActions from '../../actions/user/user.actions';

// Services
import { GoogleAuthService } from 'ng-gapi';

// RxJs
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ADD_TO_ACL_ENDPOINT, MASTER_EMAIL_ACCOUNT } from '../../shared/constants';

@Injectable()
export class UserService {
  private addToAclEndpoint = ADD_TO_ACL_ENDPOINT;
  private calendarId = MASTER_EMAIL_ACCOUNT;
  private auth;
  constructor(
    private googleAuthService: GoogleAuthService,
    private store: Store<fromRoot.State>,
    public afAut: AngularFireAuth,
    private db: AngularFirestore,
    private http: HttpClient,
    private route: Router) {
    db.firestore.settings({ timestampsInSnapshots: true });
    this.googleAuthService.getAuth()
      .pipe(first())
      .subscribe(auth => this.auth = auth);
  }

  addUser(user: User): Observable<any> {
    this.addUserToCalendarAcl(user, this.calendarId);
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

  login(): Observable<any> {
    return Observable.fromPromise(this.auth.signIn({ prompt: 'select_account' })
      .then(googleUser => {
        const credential = firebase.auth.GoogleAuthProvider
          .credential(googleUser.getAuthResponse().id_token);
        return firebase.auth().signInWithCredential(credential).then(() => {
          this.route.navigate(['/home']);
          return true;
        });   // Sign in with credential from the Google user.
      })
      .catch(r => r.error)
    );
  }

  logout() {
    this.auth.signOut().then(() => {
      this.afAut.auth.signOut()
        .then(() => {
          this.store.dispatch(new UserActions.GetUserSuccess(userInitialState));
          this.route.navigate(['/login']);
        })
        .catch(r => console.log('something wrong log out', r));
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

  addUserToCalendarAcl(user: User, calendarId = this.calendarId) {
    return this.http.get(`${this.addToAclEndpoint}?calendarId=${calendarId}&email=${user.email}`);
  }
}
