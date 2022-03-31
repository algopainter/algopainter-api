export interface MintReport {
  nft: string;
  collection: string;
  amount: string;
  creator: string;
  onSale: boolean;
}

export interface AuctionReport {
  index: number;
  nft: string;
  collection: string;
  amount: string;
  creator: string;
  sellDT?: Date;
  toClaim: boolean;
  lastBid?: string;
}

export interface AuctionUserReport extends AuctionReport {
  bidBackRate: number;
  stakePirs: string;
  stakeBidback: string;
}