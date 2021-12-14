import { ISign } from "../domain/sign";

export type IMintDataRequest = ISign<IMintData>

export interface IMintData {
  name: string;
  description: string;
  fileName: string;
  creatorRoyalty: number;
  mintedBy: string;
  image: string;
  salt: string;
}

export interface MintTokenURI {
  name: string;
  description: string;
  fileName: string;
  creatorRoyalty: number;
  mintedBy: string;
  image: string;
  previewImage: string;
  rawImage: string;
  rawImageHash: string;
}

export interface MintTokenURIResponse {
  tokenURI: string;
  data: MintTokenURI;
}