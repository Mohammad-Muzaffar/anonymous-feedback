import zod from "zod";

export const feedbackSchema = zod.object({
  postId: zod.string(),
  content: zod.string(),
  ipAddress: zod.string(),
  userToken: zod.string().optional(),
});

export const updatefeedbackSchema = zod.object({
  postId: zod.string(),
  content: zod.string(),
  ipAddress: zod.string(),
  userToken: zod.string().optional(),
});
