export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  mobile: string;
  profilePic: string;
  bio: string;
  isOnline: boolean;
  lastSeen: Date;
}

export type UserProfileUpdate = Partial<Pick<User, "name" | "username" | "bio">>;

export interface UserProfileResponse {
  success: boolean;
  message?: string;
  user: User;
}