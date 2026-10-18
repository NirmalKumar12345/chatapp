import {z} from "zod";

export const UpdateProfileSchema = z.object({
    name: z.string().trim().min(1,"Name can't be empty").max(50,"Name cannot exceed 50 characters").optional(),
    username: z.string().trim().toLowerCase().min(3,"username must be contain atlest 3 characters").max(30,"Username cannot exceed 30 characters").regex(/^[a-z0-9_]+$/,"Username can contain only letters, numbers, and underscores").optional(),
    bio: z.string().trim().max(160,"Bio cannot exceed 160 characters").optional()
}).strict().refine((data)=> Object.keys(data).length>0,"Provide at least one field to update")