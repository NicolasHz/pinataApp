export interface CalendarEventI {
    summary: string;
    location: string;
    description: string;
    start: CalTimeI;
    end: CalTimeI;
    recurrence: string[];
    attendees: any[];
    reminders: ReminderI;
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