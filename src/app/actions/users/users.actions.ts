import { Action } from '@ngrx/store';
import { User } from './../../interfaces/user';

export const SET_USERS = '[USERS] Set Users';
export const GET_USERS = '[USERS] Get Users';

export class SetUsers implements Action {
  readonly type = SET_USERS;
  constructor(public payload: User[]) {}
}

export class GetUsers implements Action {
  readonly type = GET_USERS;
  constructor(public payload: User[]) {}
}

export type UsersActions = SetUsers | GetUsers;
