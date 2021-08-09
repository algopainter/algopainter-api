import { model, Schema, Model, Document } from 'mongoose';

export interface CollectionDocument extends Document {
  title: string;
  description: string;
  owner: string;
}

export interface ICollection {
  title: CollectionDocument['title'];
  description: CollectionDocument['description'];
  owner: CollectionDocument['owner'];
}

export const CollectionSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: String, required: true, index: true }
});

export const CollectionContext: Model<CollectionDocument> = model('collections', CollectionSchema);