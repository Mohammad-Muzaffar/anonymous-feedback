import zod from "zod";

export const feedbackSchema = zod.object({
  postId: zod.string(),
  content: zod.string(),
  ipAddress: zod.string(),
  userToken: zod.string().optional(),
});

export const updateFeedbackSchema = zod.object({
  content: zod.string(),
  ipAddress: zod.string(),
  userToken: zod.string().optional(),
});

export const deleteFeedbackSchema = zod.object({
  ipAddress: zod.string(),
  userToken: zod.string().optional(),
});
