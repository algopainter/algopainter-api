import { ISign } from "../domain/sign";

export type ILikeRequest = ISign<ILikeSignData>

export interface ILikeSignData {
    imageId: string;
    salt: string | undefined | null;
}