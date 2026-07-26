import axiosInstance from "@/lib/axios";
import { SearchUsersResponse } from "@/types/search";

export const getUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};


export const searchUsers = async (
  search: string
): Promise<SearchUsersResponse> => {
  const response = await axiosInstance.get(
    `/users?search=${search}`
  );

  return response.data;
};