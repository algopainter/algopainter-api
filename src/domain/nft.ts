import { model, Schema, Model, Document } from 'mongoose';
import { IUser } from './user';

export interface INFTArtist extends IUser {
  _id: string;
}

export interface IPIRS {
  creatorRate?: number;
  investorRate?: number;
}

export interface INFTPrice {
  amount: number;
  tokenSymbol: string;
  tokenAddress: string;
}

export interface NFTDocument extends Document {
  artist: INFTArtist;
  isRecovered: boolean;
  onSale: boolean;
  supplyIndex: number;
  contractAddress: string;
  mintedBy: string;
  owner: string;
  name: string;
  pirs: IPIRS;
  collectionName: string;
  descriptor: string;
  description: string;
  image: string;
  previewImage: string;
  rawImage: string;
  initialPrice: INFTPrice;
  parameters: Record<string, unknown>;
}

export interface INFT {
  artist: NFTDocument['artist'];
  isRecovered: NFTDocument['isRecovered'];
  onSale: NFTDocument['onSale'];
  supplyIndex: NFTDocument['supplyIndex'];
  contractAddress: NFTDocument['contractAddress'];
  mintedBy: NFTDocument['mintedBy'];
  owner: NFTDocument['owner'];
  name: NFTDocument['name'];
  pirs: NFTDocument['pirs'];
  collectionName: NFTDocument['collectionName'];
  descriptor: NFTDocument['descriptor'];
  description: NFTDocument['description'];
  image: NFTDocument['image'];
  previewImage: NFTDocument['previewImage'];
  rawImage: NFTDocument['rawImage'];
  initialPrice: NFTDocument['initialPrice'];
  parameters: NFTDocument['parameters'];
}

export const NFTSchema: Schema = new Schema({
  artist: { type: Object, required: true },
  isRecovered: {
    type: Boolean, required: true,
  },
  onSale: { type: Boolean, default: false },
  supplyIndex: {
    type: Number, required: true,
  },
  contractAddress: {
    type: String,  required: true,
  },
  mintedBy: {
    type: String, required: true,
  },
  owner: {
    type: String,
  },
  pirs: {
    type: Object
  },
  name: {
    type: String, required: true,
  },
  collectionName: {
    type: String, required: true,
  },
  descriptor: {
    type: String, required: false,
  },
  description: {
    type: String, required: false,
  },
  image: {
    type: String, required: true,
  },
  previewImage: {
    type: String, required: true,
  },
  rawImage: {
    type: String, required: true,
  },
  initialPrice: { type: Object, required: true },
  parameters: {
    type: Object,
  },
});

export const NFTContext: Model<NFTDocument> = model('nfts', NFTSchema);