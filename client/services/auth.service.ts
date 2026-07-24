import axiosInstance from "@/lib/axios";
import { LoginPayload, Response, RegisterPayload } from "@/types/auth";


export const register = async (data: RegisterPayload): Promise<Response> => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
}

export const login = async (
  data: LoginPayload
): Promise<Response> => {
  const response = await axiosInstance.post("/auth/login", data);

  return response.data;
};

export const refreshToken = async(): Promise<Response>=>{
    const response = await axiosInstance.get("/auth/refresh");
    return response.data;
}

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");

  return response.data;
};