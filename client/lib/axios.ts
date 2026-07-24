import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config)=>{
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken){
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error)=>Promise.reject(error)
)
export default axiosInstance;