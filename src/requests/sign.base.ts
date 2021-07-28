export default interface ISignBase<T> {
    data: T;
    account: string;
    salt: string;
    signature: string;
}