import zod from "zod";

export const verifySchema = zod.object({
  code: zod
    .string()
    .length(6, { message: "Verification code must be 6 digits." }),
});
