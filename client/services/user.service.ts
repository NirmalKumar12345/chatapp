import axiosInstance from "@/lib/axios";

export const getUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};