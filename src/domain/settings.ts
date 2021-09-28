/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema, Model, Document } from 'mongoose';


export interface ISmartContract {
  name: string;
  address: string;
  network: string;
  rpc: string;
  statingBlock: number;
  abi: any;
}

export interface SettingsDocument extends Document {
  smartcontracts: ISmartContract[];
}

export const SetingssSchema: Schema = new Schema({
  smartcontracts: { type: [Object] },
});

export const SettingsContext: Model<SettingsDocument> = model('settings', SetingssSchema);