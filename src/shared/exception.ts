import os from 'os';

/**
 * Custom Exception class for error handling
 */
export default class Exception {
  code: number;
  status: string;
  message: string;
  metadata: string | null;

  constructor(code: number, status: string, message: string, metadata: string | null) {
    this.code = code;
    this.status = status;
    this.message = message;
    this.metadata = metadata;
  }

  get shortMessage() : string {
    return this.message;
  }

  get formattedMessage() : string {
    return `[${this.code}][${this.status}] ${this.message} ${
      this.metadata ? os.EOL + this.metadata : ''
    }`;
  }
}
