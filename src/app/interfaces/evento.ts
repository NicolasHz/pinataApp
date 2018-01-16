import { User } from './user';

export interface Evento {
    title: string;
    date: Date;
    creatorId: string;
    participants: User [];
    place: string;
    description: string;
}
