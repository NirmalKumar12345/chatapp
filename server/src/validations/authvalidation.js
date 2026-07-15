import {z} from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(3,"Name must be at least 3 characters").max(50,"Name cannot exceed 50 characters"),
    email: z.email("Invalid email address").trim().toLowerCase(),
    password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
    mobile: z.string()
    .length(10, { message: "Mobile number must be at least 10 digits long" })
    .refine((val) => /^[6-9]\d{9}$/.test(val), {
      message: "Invalid mobile number",
    }),
})

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
})