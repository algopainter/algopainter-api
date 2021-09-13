import { model, Schema, Model, Document } from 'mongoose';
import { IUser } from './user';

export interface IImageNFTInfo {
  _id: string;
  index: number;
  image: string;
  previewImage: string;
  rawImage: string;
  parameters: Record<string, unknown>;
}

export interface ImageDocument extends Document {
  title: string;
  onSale: boolean;
  likes: number;
  description: string;
  collectionName: string;
  collectionOwner: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  nft: IImageNFTInfo;
  owner: string;
  creator: string;
  users: IUser[];
  likers?: string[] | null;
}

export interface IImage {
  title: ImageDocument['title'];
  likes: ImageDocument['likes'];
  users: ImageDocument['users'];
  onSale: ImageDocument['onSale'];
  collectionName: ImageDocument['collectionName'];
  collectionOwner: ImageDocument['collectionOwner'];
  createdAt: ImageDocument['createdAt'];
  updatedAt: ImageDocument['updatedAt'];
  description: ImageDocument['description'];
  tags: ImageDocument['tags'];
  nft: ImageDocument['nft'];
  owner: ImageDocument['owner'];
  creator: ImageDocument['creator'];
  likers?: ImageDocument['likers'];
}

export const ImageSchema: Schema = new Schema({
  title: { type: String, required: true },
  likes: { type: Number, required: true },
  users: { type: [Object], required: true },
  description: { type: String, required: true },
  collectionName: { type: String, required: true },
  collectionOwner: { type: String, required: true },
  onSale: { type: Boolean, default: false },
  tags: { type: [String], required: true },
  createAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  nft: { type: Object, required: true },
  owner: { type: String, required: true, index: true },
  creator: { type: String, required: true, index: true },
  likers: { type: [String], required: false },
});

export const ImageContext: Model<ImageDocument> = model('images', ImageSchema);