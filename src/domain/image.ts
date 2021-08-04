import { model, Schema, Model, Document } from 'mongoose';
import { INFTArtist } from "./nft";
import { IUser } from './user';

export interface IImageNFTInfo {
  _id: string;
  image: string;
  previewImage: string;
  rawImage: string;
  artist: INFTArtist;
  parameters: Record<string, unknown>;
}

export interface ImageDocument extends Document {
  title: string;
  likes: number;
  description: string;
  collectionName: string;
  tags: string[];
  nft: IImageNFTInfo;
  owner: string;
  users: IUser[];
  likers?: string[] | null;
}

export interface IImage {
  title: ImageDocument['title'];
  likes: ImageDocument['likes'];
  users: ImageDocument['users'];
  collectionName: ImageDocument['collectionName'];
  description: ImageDocument['description'];
  tags: ImageDocument['tags'];
  nft: ImageDocument['nft'];
  owner: ImageDocument['owner'];
  likers?: ImageDocument['likers'];
}

export const ImageSchema: Schema = new Schema({
  title: { type: String, required: true },
  likes: { type: Number, required: true },
  users: { type: [Object], required: true },
  description: { type: String, required: true },
  collectionName: { type: String, required: true },
  tags: { type: [String], required: true },
  nft: { type: Object, required: true },
  owner: { type: String, required: true },
  likers: { type: [String], required: false },
});

export const ImageContext: Model<ImageDocument> = model('images', ImageSchema);