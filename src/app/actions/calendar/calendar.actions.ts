import { Action } from '@ngrx/store';
import { CalendarEventI } from './../../interfaces/calendar-event';

export const SET_CALENDAR = '[CALENDAR] Set Events';
// export const GET_CALENDAR = '[CALENDAR] Get Events';

export class SetCalendar implements Action {
  readonly type = SET_CALENDAR;
  constructor(public payload: CalendarEventI[]) {}
}

// export class GetCalendar implements Action {
//   readonly type = GET_CALENDAR;
//   constructor(public payload: CalendarEventI[]) {}
// }

export type CalendarActions = SetCalendar;
