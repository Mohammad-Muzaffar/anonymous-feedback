import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost extends Document {
  userId: Types.ObjectId; // Reference to the User who created the post
  title: string;
  description: string;
  link: string;
  likes: number;
  dislikes: number;
  isAcceptingFeedback: boolean;
  feedbacks: Types.ObjectId[]; // Array of feedback IDs
  createdAt: Date;
  updatedAt: Date;

  // New fields for analytics
  sentimentSummary: {
    positive: number;
    neutral: number;
    negative: number;
  }; // Sentiment breakdown
  mostUpvotedFeedback: Types.ObjectId; // Reference to the most upvoted feedback
  mostDownvotedFeedback: Types.ObjectId; // Reference to the most downvoted feedback
  commonFeedbackThemes: string[]; // List of common themes (e.g., "clarity", "pacing")
}

const PostSchema: Schema<IPost> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    link: { type: String,  unique: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    isAcceptingFeedback: { type: Boolean, default: true },
    feedbacks: [{ type: Schema.Types.ObjectId, ref: "feedbacks" }],
    // New fields for analytics
    sentimentSummary: {
      positive: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 },
      negative: { type: Number, default: 0 },
    },
    mostUpvotedFeedback: { type: Schema.Types.ObjectId, ref: "feedbacks" },
    mostDownvotedFeedback: { type: Schema.Types.ObjectId, ref: "feedbacks" },
    commonFeedbackThemes: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

const PostModel =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export default PostModel;
