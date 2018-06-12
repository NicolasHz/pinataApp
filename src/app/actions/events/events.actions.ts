import { Action } from '@ngrx/store';
import { Evento } from './../../interfaces/evento';

export const SET_EVENTS = '[EVENTS] Set Events';
export const GET_EVENTS = '[EVENTS] Get Events';

export class SetEvents implements Action {
  readonly type = SET_EVENTS;
  constructor(public payload: Evento) {}
}

export class GetEvents implements Action {
  readonly type = GET_EVENTS;
  constructor(public payload: Evento) {}
}

export type EventActions = SetEvents | GetEvents;
