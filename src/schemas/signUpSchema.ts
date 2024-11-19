import zod from "zod";

export const signUpSchema = zod.object({
  username: zod
    .string()
    .min(4, { message: "Username must be atleast 4 characters." })
    .max(20, { message: "Username should be under 20 characters." }),
  email: zod.string().email({ message: "Invalid email address." }),
  password: zod
    .string()
    .min(6, { message: "Password must be atleast 6 characters." })
    .max(20, { message: "Password should be under 20 characters." }),
});
