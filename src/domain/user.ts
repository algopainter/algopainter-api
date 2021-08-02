import { model, Schema, Model, Document } from 'mongoose';
export interface UserDocument extends Document {
  account: string;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  name?: string;
  email?: string;
  bio?: string;
  type: 'algop' | 'developer' | 'user'
  role?: "creator" | "bidder" | "owner" | 'developer' | 'investor' | null;
  customProfile?: string;
  webSite? : string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  telegram?: string | null;
  gmail?: string | null;
}

export interface IUser {
  account: UserDocument['account'];
  createdAt: UserDocument['createdAt'];
  updatedAt: UserDocument['updatedAt'];
  avatar?: UserDocument['avatar'];
  bio?: UserDocument['bio'];
  name?: UserDocument['name'];
  email?: UserDocument['email'];
  type: UserDocument['type'];
  role?: UserDocument['role'];
  customProfile?: UserDocument['customProfile'];
  webSite?: UserDocument['webSite'];
  facebook?: UserDocument['facebook'];
  instagram?: UserDocument['instagram'];
  twitter?: UserDocument['twitter'];
  telegram?: UserDocument['telegram'];
  gmail?: UserDocument['gmail'];
}

export const UserSchema: Schema = new Schema({
  account: { type: String, required: true, index: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  avatar: { type: String, required: false },
  bio: { type: String, required: false },
  name: { type: String, required: false },
  email: { type: String, required: false },
  type: { type: String, required: false },
  role: { type: String, required: false },
  customProfile: { type: String, required: false },
  webSite: { type: String, required: false },
  facebook: { type: String, required: false },
  instagram: { type: String, required: false },
  twitter: { type: String, required: false },
  telegram: { type: String, required: false },
  gmail: { type: String, required: false }
});

export const UserContext: Model<UserDocument> = model('users', UserSchema);