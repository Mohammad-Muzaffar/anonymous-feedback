import zod from "zod";

export const verifySchema = zod.object({
  username: zod
    .string()
    .min(4, { message: "Username must be atleast 4 characters." })
    .max(20, { message: "Username should be under 20 characters." }),
  code: zod
    .string()
    .length(6, { message: "Verification code must be 6 digits." }),
});
