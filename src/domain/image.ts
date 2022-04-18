import { model, Schema, Model, Document } from 'mongoose';
import { IPIRS } from './nft';
import { IUser } from './user';

export interface IImageNFTInfo {
  _id: string;
  index: number;
  image: string;
  previewImage: string;
  rawImage: string;
  sequentialNumber: number;
  parameters: Record<string, unknown>;
}
export interface IInitialPrice {
  amount: string;
  tokenSymbol: string;
  tokenAddress: string;
}
export interface ImageDocument extends Document {
  title: string;
  onSale: boolean;
  likes: number;
  description: string;
  collectionName: string;
  collectionOwner: string;
  collectionId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  nft: IImageNFTInfo;
  pirs: IPIRS;
  owner: string;
  creator: string;
  users: IUser[];
  likers?: string[] | null;
  initialPrice?: IInitialPrice;
}

export interface IImage {
  title: ImageDocument['title'];
  likes: ImageDocument['likes'];
  users: ImageDocument['users'];
  onSale: ImageDocument['onSale'];
  collectionId: string;
  collectionName: ImageDocument['collectionName'];
  collectionOwner: ImageDocument['collectionOwner'];
  createdAt: ImageDocument['createdAt'];
  updatedAt: ImageDocument['updatedAt'];
  description: ImageDocument['description'];
  tags: ImageDocument['tags'];
  nft: ImageDocument['nft'];
  pirs: ImageDocument['pirs'];
  owner: ImageDocument['owner'];
  creator: ImageDocument['creator'];
  likers?: ImageDocument['likers'];
  initialPrice?: ImageDocument['initialPrice'];
}

export const ImageSchema: Schema = new Schema({
  title: { type: String, required: true },
  likes: { type: Number, required: true },
  users: { type: [Object], required: true },
  description: { type: String, required: true },
  collectionId: { type: String, required: false },
  collectionName: { type: String, required: true },
  collectionOwner: { type: String, required: true },
  onSale: { type: Boolean, default: false },
  tags: { type: [String], required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  nft: { type: Object, required: true },
  pirs: { type: Object },
  owner: { type: String, required: true, index: true },
  creator: { type: String, required: true, index: true },
  likers: { type: [String], required: false },
  initialPrice: { type: Object, required: false },
});

export const ImageContext: Model<ImageDocument> = model('images', ImageSchema);