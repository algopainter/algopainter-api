/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema, Model, Document } from 'mongoose';

export interface TradeInDocument extends Document {
  from: string;
  to: string;
  tradedAt: Date;
  amount: number;
  feeAmount: number;
  netAmount: number;
  auction: any
}

export interface ITradeIn {
  from: TradeInDocument['from'];
  to: TradeInDocument['to'];
  tradedAt: TradeInDocument['tradedAt'];
  amount: TradeInDocument['amount'];
  feeAmount: TradeInDocument['feeAmount'];
  netAmount: TradeInDocument['netAmount'];
  auction: TradeInDocument['auction']
}

export const TradeinSchema: Schema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  tradedAt: { type: Date, required: true },
  amount: { type: Number, required: true },
  feeAmount: { type: Number, required: true },
  netAmount: { type: Number, required: true },
  auction: { type: Object, required: true },
});

export const TradeinsContext: Model<TradeInDocument> = model('tradeins', TradeinSchema);