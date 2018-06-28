import { Action } from '@ngrx/store';
import { User, GUser } from './../../interfaces/user';

export const GET_USER = '[USER] Get User';
export const GET_USER_SUCCESS = '[USER] Get User Success';
export const GET_USER_FAIL = '[USER] Get User Fail';
export const ADD_USER = '[USER] Get User';
export const ADD_USER_SUCCESS = '[USER] Get User Success';
export const ADD_USER_FAIL = '[USER] Get User Fail';

export class GetUser implements Action {
  readonly type = GET_USER;
  constructor(public payload: GUser) {}
}
export class GetUserSuccess implements Action {
readonly type = GET_USER_SUCCESS;
constructor(public payload: User) {}
}

export class GetUserFail implements Action {
  readonly type = GET_USER_FAIL;
  constructor(public payload: User) {}
  }

export class AddUser implements Action {
  readonly type = ADD_USER;
  constructor(public payload: User) {}
}

export class AddUserSuccess implements Action {
  readonly type = ADD_USER_SUCCESS;
  constructor(public payload: User) {}
}

export class AddUserFail implements Action {
  readonly type = ADD_USER_FAIL;
  constructor(public payload: User) {}
}

export type UserActions =
  GetUser
  | AddUser
  | GetUserSuccess
  | GetUserFail;