/**
 * Generic Result class for majority of actions
 */
export default class Result<T> {
  data: T | null;
  success: boolean;
  message: string | null;
  type?: number | null;

  private constructor(success: boolean, message: string | null, data: T | null = null, type: number | null = null) {
    this.data = data;
    this.success = success;
    this.message = message;
    this.type = type;
  }

  static custom<TInner>(success: boolean, message: string | null, data: TInner | null = null, type: number | null = null) : Result<TInner> {
    return new Result<TInner>(success, message, data, type);
  }

  static success<TInner>(message: string | null = null, data: TInner | null = null, type: number | null = null) : Result<TInner> {
    return new Result<TInner>(true, message, data, type);
  }

  static fail<TInner>(message: string | null = null, data: TInner | null = null, type: number | null = null) : Result<TInner> {
    return new Result<TInner>(false, message, data, type);
  }
}