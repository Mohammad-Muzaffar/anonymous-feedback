import zod from "zod";

export const voteSchema = zod.object({
  ipAddress: zod.string({ message: "Ip address is required." }),
  userToken: zod.string().optional(),
  vote: zod.enum(["upvote", "downvote"], {
    message: "vote is required, and it should be an upvote / downvote.",
  }),
});
