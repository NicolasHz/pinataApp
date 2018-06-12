import { User } from './user';

export interface Evento {
    id: string;
    title: string;
    allDay?: boolean;
    start: string;
    end: string;
    createdTime: any;
    lastEditedTime?: any;
    url?: string;
    className?: string;
    editable?: string;
    overlap?: boolean;
    color?: string;
    textColor?: string;
    creator: User;
    participants?: User [];
    place?: string;
    description: string;
    image?: string;
}
