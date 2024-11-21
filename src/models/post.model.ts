import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost extends Document {
  userId: Types.ObjectId; // Reference to the User who created the post
  title: string; // Title or question for the post
  description: string; // Optional description for the post
  link: string; // Shareable link for the post
  likes: number; // Total likes for the post
  dislikes: number; // Total dislikes for the post
  isAcceptingFeedback: boolean;
  feedbacks: Types.ObjectId[]; // Array of feedback IDs
  createdAt: Date; // Timestamp for when the post was created
  updatedAt: Date; // Timestamp for when the post was last updated
}

const PostSchema: Schema<IPost> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      required: [true, "Post link is required."],
      unique: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    isAcceptingFeedback: {
      type: Boolean,
      default: true,
    },
    feedbacks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feedback", // References the Feedback model
      },
    ],
  },
  {
    timestamps: true, // Automatically manages `createdAt` and `updatedAt`
  }
);

const PostModel =
  (mongoose.models.Post as mongoose.Model<IPost>) ||
  mongoose.model<IPost>("Post", PostSchema);

export default PostModel;
