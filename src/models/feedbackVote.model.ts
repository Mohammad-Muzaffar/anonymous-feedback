import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeedbackVote extends Document {
  feedbackId: Types.ObjectId;
  ipAddress: string;
  userToken: string;
  voteType: "upvote" | "downvote";
  createdAt: Date;
}

const FeedbackVoteSchema: Schema<IFeedbackVote> = new Schema(
  {
    feedbackId: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
      required: true,
    },
    ipAddress: { type: String, required: true },
    userToken: { type: String, required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate votes from the same IP and userToken on the same feedback
FeedbackVoteSchema.index(
  { feedbackId: 1, ipAddress: 1, userToken: 1 },
  { unique: true }
);

const FeedbackVoteModel =
  mongoose.models.FeedbackVote ||
  mongoose.model<IFeedbackVote>("FeedbackVote", FeedbackVoteSchema);
export default FeedbackVoteModel;
