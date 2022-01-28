import { ISign } from "../domain/sign";
import { ICollection } from "../domain/collection";

export type ICollectionUpdateCreateRequest = ISign<ICollectionUpdateCreateSignData>

export interface ICollectionUpdateCreateSignData extends ICollection {
    salt: string | undefined | null;
}