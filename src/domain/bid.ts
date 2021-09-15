/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema, Model, Document } from 'mongoose';

export interface BidDocument extends Document {
  bidder: string;
  auctionId: string;
  amount: number;
  tokenSymbol: string;
  createdAt: Date;
  feeAmount: number;
  netAmount: number;
  item: any;
}

export interface IBid {
  bidder: BidDocument['bidder'];
  auctionId: BidDocument['auctionId'];
  amount: BidDocument['amount'];
  tokenSymbol: BidDocument['tokenSymbol'];
  createdAt: BidDocument['createdAt'];
  feeAmount: BidDocument['feeAmount'];
  netAmount: BidDocument['netAmount'];
  item: BidDocument['item'];
}

export const BidsSchema: Schema = new Schema({
  bidder: { type: String, required: true },
  auctionId: { type: String, required: true },
  amount: { type: Number, required: true },
  tokenSymbol: { type: String, required: true },
  createdAt: { type: Date, required: true },
  feeAmount: { type: Number, required: true },
  netAmount: { type: Number, required: true },
  item: { type: Object, required: true }
});

export const BidContext: Model<BidDocument> = model('bids', BidsSchema);