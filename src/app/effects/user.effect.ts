import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import * as userActions from '../actions/user/user.actions';
import { UserService } from '../services/user/user.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class UserEffects {
    constructor(
        private actions$: Actions,
        private userService: UserService
    ) {}

    @Effect()
    getUser$ = this.actions$.ofType(userActions.GET_USER)
    .map((action: userActions.GetUser) => action.payload)
    .pipe(switchMap(payload => {
        return this.userService.getUser(payload)
        .map(user => new userActions.SetUser(user))
    }));
}
