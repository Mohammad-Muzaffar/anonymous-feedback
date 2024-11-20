import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeedback extends Document {
  postId: Types.ObjectId; // Reference to the Post
  content: string; // Feedback content
  createdAt: Date; // Timestamp for when feedback was created
  votes: Types.ObjectId[]; // Array of references to FeedbackVote
}

const FeedbackSchema: Schema<IFeedback> = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    votes: [
      {
        type: Schema.Types.ObjectId,
        ref: "FeedbackVote",
      },
    ],
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const FeedbackModel =
  (mongoose.models.Feedback as mongoose.Model<IFeedback>) ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default FeedbackModel;
