import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  feedback: string;
  createAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
  feedback: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", MessageSchema);

export default MessageModel;
