export interface MintReport {
  nft: string;
  collection: string;
  amount: string;
  creator: string;
  onSale: boolean;
}

export interface AuctionReport {
  nft: string;
  collection: string;
  amount: string;
  creator: string;
  sellDT?: Date;
  toClaim: boolean;
  lastBid?: string;
}