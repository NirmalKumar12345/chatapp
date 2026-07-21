import {z} from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters"),

    email: z.email("Please enter a valid email"),

    mobile: z
      .string()
      .min(10, "Mobile number must be 10 digits")
      .max(10, "Mobile number must be 10 digits"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

  });

export type RegisterFormData = z.infer<
  typeof registerSchema
>;