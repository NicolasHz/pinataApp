import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Router,
         RouterModule,
         ActivatedRouteSnapshot,
         RouterStateSnapshot,
         CanActivate,
         CanLoad } from '@angular/router';

import { UserService } from './../user/user.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private _loginService: UserService,
              private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this._loginService.afAut.authState.map(auth => {
      if (auth) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
