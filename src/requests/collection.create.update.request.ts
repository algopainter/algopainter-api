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
    salt: string | undefined | null;
}

export interface ICollectionApproveRequestSignData 
{ 
    collectionId: string;
    approvedBy: string;
    salt: string | undefined | null;
}

export type ICollectionApproveRequest = ISign<ICollectionApproveRequestSignData>
