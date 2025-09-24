import * as z from "zod";

export const registerSchema = z.object({
    user_name: z.string("user name must be a string").min(4, "user name should be 4 char long").max(10),
    user_email: z.email("email is required"),
    phone_no: z.number().min(10),
    password: z.string().min(8),
    first_name: z.string().min(3),
    last_name: z.string().min(3)
})

