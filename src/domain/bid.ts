import { model, Schema, Model, Document } from 'mongoose';

export interface IBidItem {
  _id: string;
  title: string;
  previewImageUrl: string;
}

export interface BidDocument extends Document {
  bidder: string;
  auctionId: string;
  amount: number;
  tokenSymbol: string;
  createdAt: Date;
  bidBack: number;
  item: IBidItem;
}

export interface IBid {
  bidder: BidDocument['bidder'];
  auctionId: BidDocument['auctionId'];
  amount: BidDocument['amount'];
  tokenSymbol: BidDocument['tokenSymbol'];
  createdAt: BidDocument['createdAt'];
  bidBack: BidDocument['bidBack'];
  item: BidDocument['item'];
}

const bidItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  previewImageUrl: { type: String, required: true }
});

export const CollectionSchema: Schema = new Schema({
  bidder: { type: String, required: true },
  auctionId: { type: String, required: true },
  amount: { type: Number, required: true },
  tokenSymbol: { type: String, required: true },
  createdAt: { type: Date, required: true },
  bidBack: { type: Number, required: true },
  item: { type: bidItemSchema, required: true }
});

export const BidContext: Model<BidDocument> = model('bids', CollectionSchema);