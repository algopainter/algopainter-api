import ISignBase from "./sign.base";

export interface ILikeRequest extends ISignBase<ILikeSignData> {
    
}

export interface ILikeSignData {
    imageId: string;
    salt: string;
}