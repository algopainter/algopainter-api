/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema, Model, Document } from 'mongoose';

export interface GLDocument extends Document {
  address: string;
  account: string;
  amount: number;
  feeAmount: number;
  netAmount: number;
  tokenSymbol: string;
  tokenAddress: string;
  when: Date,
  type: string;
  auction?: number
}

export const GLSchema: Schema = new Schema({
  address: { type: String, required: true },
  account: { type: String, required: true },
  amount: { type: Number, required: true },
  feeAmount: { type: Number, required: false },
  netAmount: { type: Number, required: false },
  tokenSymbol: { type: String, required: true },
  tokenAddress: { type: String, required: true },
  when: { type: Date, required: true },
  type: { type: String, required: true },
  auction: { type: Number, required: false }
});

export const GLContext: Model<GLDocument> = model('gls', GLSchema);