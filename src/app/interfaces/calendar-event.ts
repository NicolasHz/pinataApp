export interface CalendarEventI {
    id?: string;
    summary: string;
    location: string;
    description: string;
    start: CalTimeI;
    end: CalTimeI;
    guestsCanModify: boolean;
    recurrence: string[];
    attendees?: any[];
    reminders: ReminderI;
    status?: string;
}

export interface CalTimeI {
    dateTime: string;
    timeZone: string;
}

export interface ReminderI {
    useDefault: boolean;
    overrides: CalendarOverrideI[];
}

export interface CalendarOverrideI {
    method: string;
    minutes: number;
}
