import zod from "zod";

export const messageSchema = zod.object({
  feedback: zod
    .string()
    .min(10, { message: "Feedback message must be atleast 10 characters." }),
});
