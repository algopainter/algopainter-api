import { model, Schema, Model, Document } from 'mongoose';
import { IUser } from './user';

export interface IAuctionBid {
  amount: number;
  tokenSymbol: string;
}

export interface IAuctionBidWithUser extends IAuctionBid, IUser {
}

export interface IAuctionItem {
  _id: string;
  likes: number;
  title: string;
  previewImageUrl: string;
  collectionName: string;
  tags: string[],
  likers?: string[] | null
}

export interface IAuctionRoyalty {
  value: number;
  type: 'creator' | 'investor'
}

export interface IAuctionFees {
  bidBack: number;
  //royalties: IAuctionRoyalty[];
  //service: number;
  address: string;
  auction: string;
}

export interface AuctionDocument extends Document {
  item: IAuctionItem;
  createdAt: Date;
  expirationDt: Date;
  fee: IAuctionFees;
  isHot: boolean;
  owner: string;
  users: IUser[];
  bids: IAuctionBidWithUser[];
  categories: string[];
  minimumBid: IAuctionBid;
  highestBid: IAuctionBidWithUser;
  lowestBid: IAuctionBidWithUser;
}

export interface IAuction {
  expirationDt: AuctionDocument['expirationDt'];
  fee: AuctionDocument['fee'];
  item: AuctionDocument['item'];
  users: AuctionDocument['users'];
  createdAt: AuctionDocument['createdAt'];
  isHot: AuctionDocument['isHot'];
  owner: AuctionDocument['owner'];
  bids: AuctionDocument['bids'];
  minimumBid: AuctionDocument['minimumBid'];
  highestBid: AuctionDocument['highestBid'];
  lowestBid: AuctionDocument['lowestBid'];
  categories: AuctionDocument['categories'];
}

const itemSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  index: { type: Number, required: true },
  image: { type: String, required: true },
  previewImage: { type: String, required: true },
  rawImage: { type: String, required: true },
  collectionName: { type: String, required: true },
  collectionOwner: { type: String, required: true },
});

export const AuctionSchema: Schema = new Schema({
  likes: { type: Number, required: false },
  item: { type: itemSchema, required: true },
  fee: { type: Object, required: true },
  startDt: { type: Date, required: true },
  expirationDt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  isHot: { type: Boolean, required: true },
  ended: { type: Boolean, required: true },
  owner: { type: String, required: true },
  bids: { type: [Object], required: false },
  users: { type: [Object], required: false },
  minimumBid: { type: Object, required: false },
  highestBid: { type: Object, required: false },
  lowestBid: { type: Object, required: false }
});

export const AuctionContext: Model<AuctionDocument> = model('auctions', AuctionSchema);