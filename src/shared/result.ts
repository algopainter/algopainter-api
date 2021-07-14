/**
 * Generic Result class for majority of actions
 */
export default class Result<T> {
  data: T | null;
  success: boolean;
  message: string | null;

  private constructor(success: boolean, message: string | null, data: T | null = null) {
    this.data = data;
    this.success = success;
    this.message = message;
  }

  static success<TInner>(message: string | null = null, data: TInner | null = null) : Result<TInner> {
    return new Result<TInner>(true, message, data);
  }

  static fail<TInner>(message: string | null = null, data: TInner | null = null) : Result<TInner> {
    return new Result<TInner>(false, message, data);
  }
}