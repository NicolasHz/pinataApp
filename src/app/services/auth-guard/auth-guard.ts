import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate
} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as fromRoot from '../../app.reducer';
import * as UserActions from '../../actions/user/user.actions';
import { Store } from '@ngrx/store';
import { User, GUser } from '../../interfaces/user';
@Injectable()
export class AuthGuardService implements CanActivate {
  private user$: Observable<User>;
  private fetching: boolean;
  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    public afAut: AngularFireAuth,
    private router: Router) {
    this.user$ = this.store$.select('user');
  }

  canActivate(): Observable<boolean> {
    return this.user$
      .switchMap(user => {
        let result;
        return this.afAut.authState.switchMap(googleUser => {
          if (user.uId) {
            result = Observable.of(true);
          } else if (!user.uId && googleUser) {
            const gUser: GUser = {
              email: googleUser.email,
              uid: googleUser.uid,
              displayName: googleUser.displayName,
              photoURL: googleUser.photoURL,
              lastSignInTime: googleUser.metadata.lastSignInTime,
              creationTime: googleUser.metadata.creationTime
            };
            if (!this.fetching) {
              this.fetching = true;
              this.store$.dispatch(new UserActions.GetUser(gUser));
            }
            result = this.actions$
              .ofType(UserActions.GET_USER_SUCCESS)
              .map(action => {
                this.fetching = false;
                return action instanceof UserActions.GetUserSuccess;
              });
          } else {
            this.router.navigate(['/login']);
          }
          return result;
        });
      });
  }
}
