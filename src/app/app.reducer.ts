import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

// Interfaces
import { Evento } from './interfaces/evento';
import { User } from './interfaces/user';
import { CalendarEventI } from './interfaces/calendar-event';

// Reducers
import * as fromEvents from './reducers/events/events.reducer';
import * as fromUser from './reducers/user/user.reducer';
import * as fromCalendar from './reducers/calendar/calendar.reducer';
import * as fromUsers from './reducers/users/users.reducer';

export interface State {
  events: Evento;
  user: User;
  calendar: CalendarEventI[];
  users: User[];
}

export const reducers: ActionReducerMap<State> = {
  events: fromEvents.reducer,
  user: fromUser.reducer,
  calendar: fromCalendar.reducer,
  users: fromUsers.reducer
};

export const getEventsState = createFeatureSelector<Evento>('events');
export const getUserState = createFeatureSelector<User>('user');
export const getCalendarState = createFeatureSelector<CalendarEventI>('calendar');
export const getUsersState = createFeatureSelector<User[]>('users');
