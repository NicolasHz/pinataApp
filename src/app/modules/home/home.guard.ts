import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './../../interfaces/user';
import { Injectable } from '@angular/core';
import {
  Router,
  RouterModule,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  CanLoad
} from '@angular/router';

import { LoginService } from '../../services/login.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HomeGuard implements CanActivate {


  constructor(private _loginService: LoginService,
    private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this._loginService.afAut.authState.map((auth) => {
      if (auth) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
