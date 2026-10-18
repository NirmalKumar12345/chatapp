import axiosInstance from "@/lib/axios";
import { SearchUsersResponse } from "@/types/search";
import { UserProfileResponse, UserProfileUpdate } from "@/types/user";


export const getMyprofile = async (): Promise<UserProfileResponse> => {
  const response = await axiosInstance.get<UserProfileResponse>("/users/getMyProfile");
  return response.data;
};
export const updateProfile = async (
  userData: UserProfileUpdate
): Promise<UserProfileResponse> => {
  const response = await axiosInstance.patch<UserProfileResponse>("/users/updateMyProfile", userData);
  return response.data;
};

export const uploadProfilePicture = async (
  formData: FormData
): Promise<UserProfileResponse> => {
  const response = await axiosInstance.patch<UserProfileResponse>(
    "/users/uploadProfilePicture",
    formData
  );
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