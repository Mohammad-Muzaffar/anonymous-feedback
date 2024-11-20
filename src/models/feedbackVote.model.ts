import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeedbackVote extends Document {
  feedbackId: Types.ObjectId; // Reference to the Feedback
  ipAddress: string; // IP address of the voter
  userToken: string; // Unique token identifying the user (generated on first visit)
  voteType: "upvote" | "downvote"; // Type of vote
  createdAt: Date; // Timestamp for when the vote was created
}

const FeedbackVoteSchema: Schema<IFeedbackVote> = new Schema(
  {
    feedbackId: {
      type: Schema.Types.ObjectId,
      ref: "Feedback",
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userToken: {
      type: String,
      required: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

// Prevent duplicate votes from the same IP and userToken on the same feedback
FeedbackVoteSchema.index(
  { feedbackId: 1, ipAddress: 1, userToken: 1 },
  { unique: true }
);

const FeedbackVoteModel =
  (mongoose.models.FeedbackVote as mongoose.Model<IFeedbackVote>) ||
  mongoose.model<IFeedbackVote>("FeedbackVote", FeedbackVoteSchema);

export default FeedbackVoteModel;
