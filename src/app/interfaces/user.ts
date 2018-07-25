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
    onCalendarAcl?: boolean;
}

export interface GUser {
    email: string;
    displayName: string;
    photoURL: string;
    uid: string;
    creationTime: string;
    lastSignInTime: string;
}
