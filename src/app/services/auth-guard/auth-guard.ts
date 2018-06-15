import { Injectable } from '@angular/core';
import { Router,
         CanActivate } from '@angular/router';

import { UserService } from './../user/user.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private userService: UserService,
              private router: Router) { }

  canActivate(): Observable<boolean> {

    return this.userService.afAut.authState.map(auth => {
      if (auth) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
