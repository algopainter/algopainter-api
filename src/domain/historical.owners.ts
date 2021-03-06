import { model, Schema, Model, Document } from 'mongoose';

export interface IHistoricalOwners {
  token: number;
  from: string;
  owner: string;
  contract: string;
  createdAt: Date;
}

export interface HistoricalOwnersDocument extends Document {
  token: IHistoricalOwners['token'];
  from: IHistoricalOwners['from'];
  owner: IHistoricalOwners['owner'];
  contract: IHistoricalOwners['contract'];
  createdAt: IHistoricalOwners['createdAt'];
}

export const HOwnersSchema: Schema = new Schema({
  token: { type: Number },
  from: { type: String },
  owner: { type: String },
  contract: { type: String },
  createdAt: { type: Date },
});

export const HistoricalOwnersContext: Model<HistoricalOwnersDocument> = model('historical.owners', HOwnersSchema);