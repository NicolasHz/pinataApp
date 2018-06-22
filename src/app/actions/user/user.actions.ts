import { Action } from '@ngrx/store';
import { User } from './../../interfaces/user';

export const SET_USER = '[USER] Set User';
export const GET_USER = '[USER] Get User';
export const ADD_USER = '[USER] Get User';

export class SetUser implements Action {
  readonly type = SET_USER;
  constructor(public payload: User) {}
}

export class GetUser implements Action {
  readonly type = GET_USER;
  constructor(public payload: any) {}
}

export class AddUser implements Action {
  readonly type = ADD_USER;
  constructor(public payload: User) {}
}

export type UserActions = SetUser | GetUser | AddUser;
