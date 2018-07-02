import { User } from './user';

export interface Evento {
    id: string;
    title: string;
    start: string;
    end: string;
    creator: User;
    description: string;
    createdTime?: any;
    lastEditedTime?: any;
    allDay?: boolean;
    url?: string;
    className?: string;
    editable?: boolean;
    preferences?: string[];
    overlap?: boolean;
    color?: string;
    textColor?: string;
    participants?: User [];
    place?: string;
    image?: string;
}
