import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPostAnalytics extends Document {
  postId: Types.ObjectId; // Reference to the post
  sentimentSummary: {
    positive: number;
    neutral: number;
    negative: number;
  };
  mostUpvotedFeedback: Types.ObjectId;
  mostDownvotedFeedback: Types.ObjectId;
  commonFeedbackThemes: string[];
  feedbackCount: number; // Total feedback count for this post
  updatedAt: Date;
}

const PostAnalyticsSchema: Schema<IPostAnalytics> = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    sentimentSummary: {
      positive: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 },
      negative: { type: Number, default: 0 },
    },
    mostUpvotedFeedback: { type: Schema.Types.ObjectId, ref: "Feedback" },
    mostDownvotedFeedback: { type: Schema.Types.ObjectId, ref: "Feedback" },
    commonFeedbackThemes: { type: [String], default: [] },
    feedbackCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const PostAnalyticsModel =
  mongoose.models.PostAnalytics ||
  mongoose.model<IPostAnalytics>("PostAnalytics", PostAnalyticsSchema);
export default PostAnalyticsModel;
