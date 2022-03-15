import { model, Schema, Model, Document } from 'mongoose';
import { IKeyPair } from '../shared/helpers';
import { IBid } from './bid';
import { IUser } from './user';

export interface IAuctionBid {
  amount: number;
  tokenSymbol: string;
}

export interface IAuctionBidWithUser extends IBid, IUser {
  _id: string;
}

export interface IAuctionItem {
  _id: string;
  likes: number;
  index: number;
  title: string;
  previewImageUrl: string;
  collectionName: string;
  collectionOwner: string;
  tags: string[],
  likers?: string[] | null
}

export interface IAuctionFees {
  bidBack: number;
  address: string;
  auction: string;
}

export interface IAuctionCheck {
  endDT: Date;
  winner: string;
  bid: number;
  fee: number;
  net: number;
  creator: number;
}

export interface AuctionDocument extends Document {
  item: IAuctionItem;
  createdAt: Date;
  expirationDt: Date;
  fee: IAuctionFees;
  index: number;
  address: string;
  isHot: boolean;
  ended: boolean;
  owner: string;
  check: IAuctionCheck;
  users: IUser[];
  updatedAt: Date;
  bids: IAuctionBidWithUser[];
  returns: IKeyPair<number>;
  pirs: IKeyPair<number>;
  pirshare: IKeyPair<number>;
  bidbacks: IKeyPair<number>;
  bidbackshare: IKeyPair<number>;
  categories: string[];
  minimumBid: IAuctionBid;
  highestBid: IAuctionBidWithUser;
  lowestBid: IAuctionBidWithUser;
}

export interface IAuction {
  expirationDt: AuctionDocument['expirationDt'];
  fee: AuctionDocument['fee'];
  check: AuctionDocument['check'];
  item: AuctionDocument['item'];
  index: AuctionDocument['index'];
  address: AuctionDocument['address'];
  users: AuctionDocument['users'];
  createdAt: AuctionDocument['createdAt'];
  updatedAt: Date;
  ended: boolean;
  isHot: AuctionDocument['isHot'];
  owner: AuctionDocument['owner'];
  bids: AuctionDocument['bids'];
  returns: AuctionDocument['returns'];
  bidbacks: AuctionDocument['bidbacks'];
  bidbackshare: AuctionDocument['bidbackshare'];
  pirs: AuctionDocument['pirs'];
  pirshare: AuctionDocument['pirshare'];
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
  check: { type: Object, required: false },
  startDt: { type: Date, required: true },
  expirationDt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  index: { type: Number, required: true },
  address: { type: String, required: false },
  isHot: { type: Boolean, required: true },
  ended: { type: Boolean, required: true },
  owner: { type: String, required: true },
  bids: { type: [Object], required: false },
  returns: { type: Object, required: false },
  bidbacks: { type: Object, required: false },
  bidbackshare: { type: Object, required: false },
  pirs: { type: Object, required: false },
  pirshare: { type: Object, required: false },
  users: { type: [Object], required: false },
  minimumBid: { type: Object, required: false },
  highestBid: { type: Object, required: false },
  lowestBid: { type: Object, required: false }
});

export const AuctionContext: Model<AuctionDocument> = model('auctions', AuctionSchema);