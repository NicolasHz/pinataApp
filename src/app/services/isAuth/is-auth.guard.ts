import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      return this.userService.afAut.authState.map(auth => {
        if (auth) {
          this.router.navigate(['/home']);
        } else {
          return true;
        }
      });
  }
}
