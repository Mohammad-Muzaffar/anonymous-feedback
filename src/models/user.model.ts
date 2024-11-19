import mongoose, { Schema, Document } from "mongoose";
import { MessageSchema, Message } from "./message.model";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

export const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required."],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required."],
    unique: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      "please enter a valid email address.",
    ],
  },
  password: {
    type: String,
    required: [true, "password is required."],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required."],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verify code expiry date is required."],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
