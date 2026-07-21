import axiosInstance from "@/lib/axios";
import { LoginPayload, LoginResponse, RegisterPayload } from "@/types/auth";


export const register = async (payload: RegisterPayload)=>{
    const response = await axiosInstance.post("/auth/register", payload);
    return response.data;
}

export const login = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/auth/login", data);

  return response.data;
};

export const refreshToken = async()=>{
    const response = await axiosInstance.get("/auth/refresh");
    return response.data;
}

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");

  return response.data;
};