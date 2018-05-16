export interface User {
    email: string;
    fullName: string;
    profilePicUrl: string;
    uId: string;
    preferences?: Array<string>;
    isNewUser?: boolean;
}
