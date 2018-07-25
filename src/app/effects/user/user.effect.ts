import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import * as userActions from '../../actions/user/user.actions';
import { UserService } from '../../services/user/user.service';
import { switchMap } from 'rxjs/operators';
import { User } from '../../interfaces/user';
import { MzToastService } from 'ngx-materialize';
import { SimpleModalService } from '../../shared/simple-modal/simple-modal.service';
import { UtilsService } from '../../services/utils/utils.service';
@Injectable()
export class UserEffects {
    constructor(
        private simpleModalService: SimpleModalService,
        private actions$: Actions,
        private userService: UserService,
        private toastService: MzToastService,
        private util: UtilsService
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
                            if (user.dateOfBirth && this.util.isTodayBirthday(user)) {
                                const modalData = {
                                    title: `Happy Birthday!! <br> ${user.fullName}`,
                                    message: 'Have a really nice day!',
                                    image: user.profilePicUrl
                                };
                                this.simpleModalService.openModal(modalData);
                            }
                            return new userActions.GetUserSuccess(user);
                        } else {
                            const user = this.createUser(payload, true);
                            return new userActions.AddUser(user);
                        }
                    })
                    .catch(err => {
                        console.log('you lazy ass, do the getUser fail action', err);
                        return Observable.of(new userActions.GetUserFail());
                    });
            })
        );

    @Effect()
    addUser$ = this.actions$.ofType(userActions.ADD_USER)
        .map((action: userActions.AddUser) => action.payload)
        .pipe(
            switchMap(user => {
                return this.userService
                    .addUser(user)
                    .mergeMap(() => {
                        this.toastService.show('Profile Created!', 4000, 'green', () => {
                            this.toastService.show('Now, you should go to your profile and update it!', 4000, 'green', );
                        });
                        const modalData = {
                            title: `Welcome to Piñata!! <br> ${user.fullName}`,
                            message: 'Have a really nice day!',
                            image: user.profilePicUrl
                        };
                        this.simpleModalService.openModal(modalData);
                        return [new userActions.AddUserSuccess(user), new userActions.AddUserToAcl(user)];
                    })
                    .catch(err => {
                        this.toastService.show('Something went wrong please try again', 400, 'red');
                        console.log('you lazy ass, do the addUser fail action', err);
                        return Observable.of(new userActions.AddUserFail());
                    });
            })
        );

    @Effect()
    addUserToAcl$ = this.actions$.ofType(userActions.ADD_USER_TO_ACL)
        .map((action: userActions.AddUserToAcl) => action.payload)
        .pipe(
            switchMap(user => {
                return this.userService
                    .addUserToCalendarAcl(user)
                    .map(() => {
                        return new userActions.AddUserToAclSuccess(true);
                    })
                    .catch(() => {
                        return Observable.of(new userActions.AddUserToAclFail(false));
                    });
            })
        );

    @Effect()
    updateUser$ = this.actions$.ofType(userActions.UPDATE_USER)
        .map((action: userActions.UpdateUser) => action.payload)
        .pipe(
            switchMap(user => {
                return this.userService
                    .addUser(user)
                    .map(() => {
                        if (user.dateOfBirth && this.util.isTodayBirthday(user)) {
                            const modalData = {
                                title: `Happy Birthday!! <br> ${user.fullName}`,
                                message: 'Have a really nice day!',
                                image: user.profilePicUrl
                            };
                            this.simpleModalService.openModal(modalData);
                        }
                        this.toastService.show('Profile Updated!', 4000, 'green');
                        return new userActions.UpdateUserSuccess(user);
                    })
                    .catch(err => {
                        this.toastService.show('Something went wrong please try again', 400, 'red');
                        console.log('you lazy ass, do the addUser fail action', err);
                        return Observable.of(new userActions.UpdateUserFail());
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
