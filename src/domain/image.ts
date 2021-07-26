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

export interface IImageAuthority extends IUser {
  _id: string;
}

export interface ImageDocument extends Document {
  title: string;
  likes: number;
  description: string;
  tags: string[];
  nft: IImageNFTInfo;
  users: IImageAuthority[];
}

export interface IImage {
  title: ImageDocument['title'];
  likes: ImageDocument['likes'];
  description: ImageDocument['description'];
  tags: ImageDocument['tags'];
  nft: ImageDocument['nft'];
  users: ImageDocument['users'];
}

export const ImageSchema: Schema = new Schema({
  title: { type: String, required: true },
  likes: { type: Number, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  nft: { type: Object, required: true },
  users: { type: [Object], required: true },
});

export const ImageContext: Model<ImageDocument> = model('images', ImageSchema);