import { ISign } from "../domain/sign";
import { IUser } from "../domain/user";

export type IUserUpdateRequest = ISign<IUserUpdateSignData>

export interface IUserUpdateSignData extends IUser {
    salt: string | undefined | null;
}