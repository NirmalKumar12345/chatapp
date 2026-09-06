import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

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
let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[]=[];

const proccessQueue =(
  error: unknown,
  token: string | null=null
)=>{
  failedQueue.forEach((request)=>{
    if(error){
      request.reject(error);
    }else if(token){
      request.resolve(token)
    }
  });
  failedQueue=[];
}

axiosInstance.interceptors.response.use(
  (response)=>response,
  async (error: AxiosError)=>{
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; };
    //handle only 401 responses
    if (error.response?.status !==401){
      return Promise.reject(error);
    }
    //Don't try to refresh the refresh  endpoint itself
    if(originalRequest?.url?.includes("/auth/refresh")){
      return Promise.reject(error);
    }
    //prevent infinite retry
    if (originalRequest?._retry){
      return Promise.reject(error);
    }
    //refresh already happening wait for all request
    if(isRefreshing){
      return new Promise((resolve,reject)=>{
        failedQueue.push({
          resolve: (token)=>{
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          },
          reject,
        });
      })
    }
    originalRequest._retry = true;
    isRefreshing=true;
    try{
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,{
        withCredentials:true,
      });
      const newAccessToken = response?.data.accessToken;
      //save the new Access token
      useAuthStore.getState().setAccessToken(newAccessToken);
      //resolve all waiting request 
      proccessQueue(null,newAccessToken);
      //add new toke to originalRequest
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      //retry the original request with new access token
      return axiosInstance(originalRequest);
    }
    catch(refreshError){
      //refresh failed
      proccessQueue(refreshError,null);
      //refresh token is invalid/expired
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    }finally{
      isRefreshing = false;
    }
  }
)
export default axiosInstance;