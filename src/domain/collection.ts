import { model, Schema, Model, Document } from 'mongoose';
import { IImage } from './image';
import { IUser } from './user';

export interface ICollectionImage extends IImage {
  _id: string;
}

export interface CollectionDocument extends Document {
  title: string;
  description: string;
  images: ICollectionImage[];
  owner: string;
}

export interface ICollection {
  title: CollectionDocument['title'];
  description: CollectionDocument['description'];
  images: CollectionDocument['images'];
  owner: CollectionDocument['owner'];
}

export const CollectionSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [Object], required: true },
  owner: { type: String, required: true }
});

export const CollectionContext: Model<CollectionDocument> = model('collections', CollectionSchema);