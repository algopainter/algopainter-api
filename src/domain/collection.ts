import { model, Schema, Model, Document } from 'mongoose';



export interface CollectionDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  items: 
}

export interface ICollection {
  account: CollectionDocument['account'];
  createdAt: CollectionDocument['createdAt'];
  updatedAt: CollectionDocument['updatedAt'];
  avatar: CollectionDocument['avatar'];
  name: CollectionDocument['name'];
  role: CollectionDocument['role']
}

export const UserSchema: Schema = new Schema({
  account: { type: String, required: true, index: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  avatar: { type: Date, required: true },
  name: { type: Date, required: true },
  role: { type: Date, required: true },
});

export const AttendanceContext: Model<UserDocument> = model('collections', UserSchema);