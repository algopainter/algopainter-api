import { model, Schema, Model, Document } from 'mongoose';

export interface SignDocument extends Document {
  data: unknown;
  createdAt: Date;
  account: string;
  salt?: string | null;
  signature: string;
  action: string;
}

export interface ISign<T> {
  data: T;
  createdAt: SignDocument['createdAt'];
  account: SignDocument['account'];
  salt: SignDocument['salt'];
  action: SignDocument['action'];
  signature: SignDocument['signature'];
}

export const SignSchema: Schema = new Schema({
  data: { type: Object, required: true },
  createdAt: { type: Date, required: true },
  account: { type: String, required: true, index: true },
  salt: { type: String, required: true, index: true },
  action: { type: String, required: true },
  signature: { type: String, required: true },
});

export const SignContext: Model<SignDocument> = model('signs', SignSchema);