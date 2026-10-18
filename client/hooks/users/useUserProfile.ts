import {
    getMyprofile,
    updateProfile,
    uploadProfilePicture,
} from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { UserProfileResponse, UserProfileUpdate } from "@/types/user";

const userProfileQueryKey = (userId: string) => ["my-profile", userId];

export const useMyProfile = () => {
    const userId = useAuthStore((state) => state.user?._id);

    return useQuery({
        queryKey: userProfileQueryKey(userId ?? ""),
        queryFn: getMyprofile,
        enabled: Boolean(userId),
    });
};

export const useUserProfile = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const queryClient = useQueryClient();

    return useMutation<
        UserProfileResponse,
        AxiosError<{ message?: string }>,
        UserProfileUpdate
    >({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            setUser(data.user);
            queryClient.setQueryData(userProfileQueryKey(data.user._id), data);
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message ?? "Failed to update profile");
        },
    });
};

export const useUploadProfilePicture = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const queryClient = useQueryClient();

    return useMutation<
        UserProfileResponse,
        AxiosError<{ message?: string }>,
        File
    >({
        mutationFn: (file: File) => {
            const formData = new FormData();
            formData.append("profilePic", file);
            return uploadProfilePicture(formData);
        },
        onSuccess: (data) => {
            setUser(data.user);
            queryClient.setQueryData(userProfileQueryKey(data.user._id), data);
            toast.success(data.message);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message ?? "Failed to upload profile picture");
        },
    });
};