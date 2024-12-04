import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPostVote extends Document {
  postId: Types.ObjectId; // Reference to the post
  ipAddress: string; // Hashed IP for anonymous users
  userToken: string; // Unique token for anonymous users
  voteType: "like" | "dislike"; // Vote type
}

const PostVoteSchema: Schema<IPostVote> = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    ipAddress: { type: String, required: true }, // Store hashed IP address
    userToken: { type: String, required: true }, // Use for tracking anonymous users
    voteType: { type: String, enum: ["like", "dislike"], required: true },
  },
  {
    timestamps: true, // Track when the vote was cast
  }
);

const PostVoteModel =
  mongoose.models.PostVote ||
  mongoose.model<IPostVote>("PostVote", PostVoteSchema);

export default PostVoteModel;
