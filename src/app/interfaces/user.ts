export interface User {
    email: string;
    fullName: string;
    profilePicUrl: string;
    uId: string;
    preferences?: string[];
    isNewUser?: boolean;
    dateOfBirth?: string;
    onBirthdayList?: boolean;
    hasPayed?: boolean;
    lastTimeSignedIn?: string;
    userSince?: string;
    lastTimeModified?: string;
}

export const userInitialState = {
    email: '',
    fullName: '',
    profilePicUrl: '',
    uId: '',
    preferences: [],
    isNewUser: true,
    dateOfBirth: '',
    onBirthdayList: false,
    hasPayed: false,
    lastTimeSignedIn: '',
    userSince: '',
    lastTimeModified: ''
};
