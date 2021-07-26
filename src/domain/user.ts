import { model, Schema, Model, Document } from 'mongoose';
export interface UserDocument extends Document {
  account: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  name: string;
  bio?: string;
  networks: INetwork[];
  type: 'algop' | 'developer' | 'user'
  role: "creator" | "bidder" | "owner" | 'developer' | 'investor';
}

export interface INetwork {
  type: string | 'instagram' | 'facebook' | 'github' | 'twitter' | 'telegram' | 'website';
  name: string;
  url: string; 
}

export interface IUser {
  account: UserDocument['account'];
  createdAt: UserDocument['createdAt'];
  updatedAt: UserDocument['updatedAt'];
  avatar?: UserDocument['avatar'];
  networks: UserDocument['networks'];
  bio?: UserDocument['bio'];
  name: UserDocument['name'];
  type: UserDocument['type'];
  role: UserDocument['role'];
}

export const UserSchema: Schema = new Schema({
  account: { type: String, required: true, index: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  avatar: { type: String, required: true },
  bio: { type: String, required: false },
  networks: { type: [Object], required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  role: { type: String, required: true },
});

export const UserContext: Model<UserDocument> = model('users', UserSchema);