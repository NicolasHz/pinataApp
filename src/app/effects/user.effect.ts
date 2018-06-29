import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import * as userActions from '../actions/user/user.actions';
import { UserService } from '../services/user/user.service';
import { switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Injectable()
export class UserEffects {
    constructor(
        private actions$: Actions,
        private userService: UserService
    ) { }

    @Effect()
    getUser$ = this.actions$
        .ofType(userActions.GET_USER)
        .map((action: userActions.GetUser) => action.payload)
        .pipe(
            switchMap(payload => {
                return this.userService
                    .getUser(payload)
                    .map(doc => {
                        if (doc.exists) {
                            const userData = doc.data();
                            const user = this.createUser(userData);
                            if (payload.creationTime !== payload.lastSignInTime && userData.isNewUser) {
                                user.isNewUser = false;
                            }
                            return new userActions.GetUserSuccess(user);
                        } else {
                            console.log('adding')
                            const user = this.createUser(payload, true);
                            return new userActions.AddUser(user);
                        }
                    })
                    .catch(err => {
                        console.log('you lazy shit, do the getUser fail action', err);
                        return Observable.of(new userActions.GetUserFail());
                    });
            })
        );

    @Effect()
    addUser$ = this.actions$.ofType(userActions.ADD_USER)
        .map((action: userActions.AddUser) => action.payload)
        .pipe(
            switchMap(payload => {
                return this.userService
                    .addUser(payload)
                    .map(() => {
                        return new userActions.AddUserSuccess(payload);
                    })
                    .catch(err => {
                        console.log('you lazy shit, do the addUser fail action', err);
                        return Observable.of(new userActions.AddUserFail());
                    });
            })
        );

    createUser(userData, addUser = false): User {
        let user: User;
        if (addUser) {
            user = {
                email: userData.email,
                fullName: userData.displayName,
                profilePicUrl: userData.photoURL,
                uId: userData.uid,
                isNewUser: userData.creationTime === userData.lastSignInTime,
                preferences: [],
                dateOfBirth: '',
                onBirthdayList: false,
                hasPayed: false,
                lastTimeSignedIn: userData.lastSignInTime,
                userSince: userData.creationTime,
                lastTimeModified: new Date().toISOString()
            };
        } else {
            user = {
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
        }
        return user;
    }
}
