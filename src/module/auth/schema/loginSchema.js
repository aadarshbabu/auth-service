import * as z from "zod";

export const loginSchema = z.object({
    user_email: z.email("user email is required"),
    password: z.string("password is required")
})