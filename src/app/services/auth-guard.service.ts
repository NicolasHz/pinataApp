import { Injectable } from '@angular/core';
import { Router,
         RouterModule,
         ActivatedRouteSnapshot,
         RouterStateSnapshot,
         CanActivate,
         CanLoad } from '@angular/router';

import { LoginService } from './login.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private _loginService: LoginService) { }

  canActivate() {
    if (this._loginService.user.uID) {
      return true;
    }
    return false;
  }
}
