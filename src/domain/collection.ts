import { model, Schema, Model, Document } from 'mongoose';
import v8n from "v8n";

export interface CollectionDocument extends Document {
  title: string;
  description: string;
  show: boolean;
  isCustom: boolean;
  owner: string;
  avatar: string | null | undefined;
  account: string;
  metrics: ICollectionMetrics | null | undefined;
  api: ICollectionNFTCreationAPI | null | undefined;
}

export interface ICollectionMetrics {
  nfts: number;
  startDT: Date;
  endDT: Date;
  priceType: 'fixed' | 'variable';
  tokenPriceAddress: string | null | undefined;
  tokenPriceSymbol: string | null | undefined; // ETH ALGOP 
  priceRange: ICollectionMetricsPriceRange[] | null | undefined;
  creatorPercentage: number;
  walletAddress: string;
}

export interface ICollectionMetricsPriceRange {
  from: number;
  to: number;
  amount: number;
  tokenPriceAddress: string;
  tokenPriceSymbol: string;
}

export interface ICollectionNFTCreationAPI {
  url: string;
  parameters: any //JsonSchema
}

export interface ICollection {
  title: CollectionDocument['title'];
  description: CollectionDocument['description'];
  owner: CollectionDocument['owner'];
  show: CollectionDocument['show'];
  isCustom: CollectionDocument['isCustom'];
  avatar: CollectionDocument['avatar'];
  account: CollectionDocument['account'];
  metrics: CollectionDocument['metrics'];
  api: CollectionDocument['api'];
}

export const CollectionSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  show: { type: Boolean, required: false },
  owner: { type: String, required: true, index: true },
  avatar: { type: String, required: false },
  account: { type: String, required: true, index: true },
  metrics: { type: Object, required: false },
  api: { type: Object, required: false },
});

export const CollectionContext: Model<CollectionDocument> = model('collections', CollectionSchema);

function priceTypeValidation() {
  return (value: string) => value === "fixed" || value === "variable";
}

v8n.extend({ priceTypeValidation });

export const CollectionValidator = function(data: ICollection) {
  if(!data.title || data.title.length <= 6 || data.title.length > 30) {
    return '[title] is invalid.'
  }

  if(!data.description || data.description.length > 500) {
    return '[description] is invalid.'
  }

  if(!data.account || data.account.length != 42) {
    return '[account] is invalid.'
  }

  if(!data.metrics) {
    return '[metrics] is invalid.'
  } else {
    if(!data.metrics.nfts || data.metrics.nfts > 1000 || data.metrics.nfts <= 0) {
      return '[metrics.nfts] is invalid.'
    }

    if(!data.metrics.priceType || !['fixed', 'variable'].includes(data.metrics.priceType)) {
      return '[metrics.priceType] is invalid.'
    }

    if(!data.metrics.creatorPercentage || data.metrics.creatorPercentage < 0 || data.metrics.creatorPercentage > 3000) {
      return '[metrics.creatorPercentage] is invalid.'
    }

    if(!data.metrics.walletAddress || data.metrics.walletAddress.length != 42) {
      return '[metrics.walletAddress] is invalid.'
    }
  }

  return null;
};

export const x = v8n().schema({
  title: v8n().string().minLength(6).maxLength(30),
  description: v8n().string().maxLength(500),
  avatar: v8n().string(),
  account: v8n().string().minLength(42).maxLength(42),
  metrics: v8n().schema({
    ntfs: v8n().number().between(1, 1000),
    priceType: v8n().string().priceTypeValidation(),
    tokenPriceAddress: v8n().string().minLength(42).maxLength(42),
    tokenPriceSymbol: v8n().string().minLength(2).maxLength(10),
    priceRange: v8n().passesAnyOf(v8n().array().every.schema({
      from: v8n().number().between(1, Number.MAX_VALUE),
      to: v8n().number().between(1, Number.MAX_VALUE),
      amount: v8n().number().between(1, Number.MAX_VALUE),
      tokenPriceAddress: v8n().string().minLength(42).maxLength(42),
      tokenPriceSymbol: v8n().string().minLength(2).maxLength(10),
    }), v8n().null(), v8n().undefined()),
    creatorPercentage: v8n().number().between(0, 30),
    walletAddress: v8n().string().minLength(42).maxLength(42)
  }),
  api: v8n().schema({
    url: v8n().string()
  }),
});