import { ISign } from "../domain/sign";
import { ICollection } from "../domain/collection";

export type ICollectionUpdateCreateRequest = ISign<ICollectionUpdateCreateSignData>

export interface ICollectionUpdateCreateSignData extends ICollection {
    salt: string | undefined | null;
}


export type ICollectionPatchRequest = ISign<ICollectionPatchRequestSignData>

export interface ICollectionPatchRequestSignData {
    avatar: string;
    description: string;
    api: any;
    website: string;
    salt: string | undefined | null;
}

export interface ICollectionApproveRequestSignData 
{ 
    collectionId: string;
    approvedBy: string;
    salt: string | undefined | null;
}

export type ICollectionApproveRequest = ISign<ICollectionApproveRequestSignData>

export interface ICollectionExternalNFTRequestSignData 
{ 
    address: string;
    name: string;
    account: string;
    nfts: any[],
    salt: string | undefined | null;
}

export type ICollectionExternalNFTRequest = ISign<ICollectionExternalNFTRequestSignData>

