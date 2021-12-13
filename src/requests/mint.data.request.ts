import { ISign } from "../domain/sign";

export type IMintDataRequest = ISign<IMintData>

export interface IMintData {
  name: string;
  description: string;
  creatorRoyalty: number;
  mintedBy: string;
  image: string;
  salt: string;
}

export interface MintTokenURIResponse {
  name: string;
  description: string;
  creatorRoyalty: number;
  mintedBy: string;
  image: string;
  previewImage: string;
  rawImage: string;
}