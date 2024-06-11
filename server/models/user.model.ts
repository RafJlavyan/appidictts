import mongoose, { Schema, Document } from "mongoose";

export interface UserType {
  _id: string;
  googleId?: string;
  username: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  credits: number;
}

const UserSchema: Schema = new Schema(
  {
    googleId: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isAdmin: { type: Boolean, default: false },
    credits: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<UserType>("User", UserSchema);

export default UserModel;
