export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  profilePic: string;
  bio: string;
  isOnline: boolean;
  lastSeen: Date;
}