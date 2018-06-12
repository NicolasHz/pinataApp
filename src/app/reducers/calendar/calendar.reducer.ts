import { CalendarEventI } from './../../interfaces/calendar-event';
import { calendarInitialState } from './../../interfaces/calendar-event-initial.state';
import * as calendarActions from './../../actions/calendar/calendar.actions';

export function reducer(
  state = [calendarInitialState],
  action: calendarActions.CalendarActions
): CalendarEventI[] {
  switch (action.type) {
    case calendarActions.SET_CALENDAR: {
      return Object.assign({}, state, action.payload);
    }
    case calendarActions.GET_CALENDAR: {
      return Object.assign({}, state, action.payload);
    }
    default: {
      return state;
    }
  }
}
