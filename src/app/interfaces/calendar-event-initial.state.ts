import { CalendarEventI } from './calendar-event';
export const calendarInitialState: CalendarEventI = {
  id: '',
  summary: '',
  location: '',
  description: '',
  start: {
    dateTime: '',
    timeZone: ''
  },
  end: {
    dateTime: '',
    timeZone: ''
  },
  guestsCanModify: true,
  recurrence: [],
  attendees: [],
  reminders: {
    useDefault: true,
    overrides: [{
      method: '',
      minutes: 10
    }]
  },
  status: '',
  visibility: ''
};
