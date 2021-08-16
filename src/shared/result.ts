/**
 * Generic Result class for majority of actions
 */
export default class Result<T> {
  static get TYPE_NOT_FOUND(): string { return 'NOTFOUND' }

  data: T | null;
  success: boolean;
  message: string | null;
  type?: number | null;
  code?: number | null;

  private constructor(success: boolean, message: string | null, data: T | undefined | null = null, type: number | null = null, code: number | null = null) {
    this.data = data;
    this.success = success;
    this.message = message;
    this.type = type;
    this.code = code;
  }

  static custom<TInner>(success: boolean, message: string | null, data: TInner | undefined | null = null, type: number | null = null, code: number | null = null) : Result<TInner> {
    return new Result<TInner>(success, message, data, type, code);
  }

  static success<TInner>(message: string | null = null, data: TInner | undefined | null = null, type: number | null = null, code: number | null = null) : Result<TInner> {
    return new Result<TInner>(true, message, data, type, code);
  }

  static fail<TInner>(message: string | null = null, data: TInner | undefined | null = null, type: number | null = null, code: number | null = null) : Result<TInner> {
    return new Result<TInner>(false, message, data, type, code);
  }

  static failure(message: string | null = null, data: never | undefined | null = null, type: number | null = null, code: number | null = null) : Result<never> {
    return new Result<never>(false, message, data, type, code);
  }
  
  static message(type: string) : string {
    switch(type) {
      case this.TYPE_NOT_FOUND:
        return 'The request data is not found!'
      default:
        return '';
    }
  }
}