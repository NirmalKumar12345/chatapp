import { User } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  mobile: string;
}

export interface Response {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
}