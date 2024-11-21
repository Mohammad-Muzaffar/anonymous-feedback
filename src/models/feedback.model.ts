import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeedback extends Document {
  postId: Types.ObjectId;
  content: string;
  votes: Types.ObjectId[];
  sentiment: "positive" | "neutral" | "negative"; // Sentiment assigned to this feedback
  voteCount: {
    upvotes: number;
    downvotes: number;
  };
}

const FeedbackSchema: Schema<IFeedback> = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true, trim: true },
    votes: [{ type: Schema.Types.ObjectId, ref: "FeedbackVote" }],
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
    },
    voteCount: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const FeedbackModel =
  mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);
export default FeedbackModel;
