export interface User {
    fullName: string;
    // birthday: Date;
    profilePicUrl: string;
    // isBuyer: boolean;
    uId: string;
    preferences?: Array<string>;
}
