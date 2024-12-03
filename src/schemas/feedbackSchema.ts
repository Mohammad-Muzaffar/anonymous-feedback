import zod from "zod";

export const feedbackSchema = zod.object({
  postId: zod.string({ message: "post id is required." }),
  content: zod.string({ message: "content is required." }),
  // ipAddress: zod.string({ message: "Ip address is required." }),
  userToken: zod.string().optional(),
});

export const updateFeedbackSchema = zod.object({
  content: zod.string({ message: "content is required." }),
  // ipAddress: zod.string({ message: "Ip address is required." }),
  userToken: zod.string().optional(),
});

export const deleteFeedbackSchema = zod.object({
  // ipAddress: zod.string({ message: "Ip address is required." }),
  userToken: zod.string().optional(),
});
