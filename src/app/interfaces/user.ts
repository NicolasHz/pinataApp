export interface User {
    email: string;
    fullName: string;
    profilePicUrl: string;
    uId: string;
    preferences?: Array<string>;
    isNewUser?: boolean;
    dateOfBirth?: string;
    onBirthdayList?: boolean;
    hasPayed?: boolean;
    lastTimeSignedIn?: string;
    userSince?: string;
}
