import { model, Schema, Model, Document } from 'mongoose';
export class UserDocument extends Document {
  account: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: string;
  name: string;
  role: "creator" | "bidder" | "owner"
}

export interface IUser {
  account: UserDocument['account'];
  createdAt: UserDocument['createdAt'];
  updatedAt: UserDocument['updatedAt'];
  avatar: UserDocument['avatar'];
  name: UserDocument['name'];
  role: UserDocument['role']
}

export const UserSchema: Schema = new Schema({
  account: { type: String, required: true, index: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  avatar: { type: Date, required: true },
  name: { type: Date, required: true },
  role: { type: Date, required: true },
});

export const AttendanceContext: Model<UserDocument> = model('users', UserSchema);