import zod from "zod";

export const postSchema = zod.object({
  title: zod.string(),
  description: zod.string().optional(),
});

export const updatePostSchema = zod.object({
  title: zod.string().optional(),
  description: zod.string().optional(),
});
