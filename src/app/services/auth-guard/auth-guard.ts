import { Injectable } from '@angular/core';
import { Router,
         CanActivate } from '@angular/router';
import 'rxjs/add/operator/catch';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as fromRoot from '../../app.reducer';
import * as UserActions from '../../actions/user/user.actions';
import { Store } from '@ngrx/store';
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private store: Store<fromRoot.State>,
    public afAut: AngularFireAuth,
    private router: Router) { }

    getUser(): Observable<any> {
      return this.afAut.authState.map(googleUser => {
        if (googleUser) {
         this.store.dispatch(new UserActions.GetUser(googleUser))
        } else {
          this.router.navigate(['/login']);
        }
      });
  }

  canActivate(): Observable<boolean> {
    return this.getUser()
      .switchMap(() => of(true))
      .catch(() => of(false));
  }
}
