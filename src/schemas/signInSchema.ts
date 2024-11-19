import zod from "zod";

export const signInSchema = zod.object({
  email: zod.string().email({ message: "Invalid email address." }),
  password: zod
    .string()
    .min(6, { message: "Password must be atleast 6 characters." })
    .max(20, { message: "Password should be under 20 characters." }),
});
