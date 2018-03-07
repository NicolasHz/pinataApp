import { User } from './user';

export interface Event {
    id: string;
    title: string;
    allDay?: boolean;
    start: string;
    end: string;
    url?: string;
    className?: string;
    editable?: string;
    overlap?: boolean;
    color?: string;
    textColor?: string;
    creatorId?: string;
    participants?: User [];
    place?: string;
    description?: string;
    image?: string;
}

export const eventInitialState: Event = {
    id: null,
    title: null,
    allDay: null,
    start: null,
    end: null,
    url: null,
    className: null,
    editable: null,
    overlap: null,
    color: null,
    textColor: null,
    creatorId: null,
    participants: [],
    place: null,
    description: null,
    image: null
};
