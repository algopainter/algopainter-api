/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema, Model, Document } from 'mongoose';


export interface ISmartContract {
  name: string;
  symbol: string;
  address: string;
  network?: string;
  rpc?: string;
  statingBlock?: number;
  blockExplorer: string;
  abi?: any;
  inUse: boolean;
}

export interface ITokens {
  name: string;
  label: string;
  img: string;
  decimalPlaces: number;
  tokenAddress: string;
}

export interface SettingsDocument extends Document {
  tokens: ITokens[];
  smartcontracts: ISmartContract[];
}

export const SetingssSchema: Schema = new Schema({
  tokens: { type: [Object] },
  smartcontracts: { type: [Object] },
});

export const SettingsContext: Model<SettingsDocument> = model('settings', SetingssSchema);