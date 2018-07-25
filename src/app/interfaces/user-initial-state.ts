import { User } from './user';

export const userInitialState: User = {
  email: '',
  fullName: '',
  profilePicUrl: '',
  uId: '',
  preferences: null,
  isNewUser: true,
  dateOfBirth: '',
  onBirthdayList: false,
  hasPayed: false,
  lastTimeSignedIn: '',
  userSince: '',
  lastTimeModified: '',
  onCalendarAcl: false
};
