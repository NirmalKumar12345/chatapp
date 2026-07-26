import { User } from "./user";

export interface SearchUsersResponse {
  success: boolean;
  users: User[];
}