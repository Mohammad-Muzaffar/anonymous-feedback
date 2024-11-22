import zod from "zod";

export const postSchema = zod.object({
  title: zod.string(),
  description: zod.string().optional(),
});
