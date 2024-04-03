class ApiError extends Error {
  public statusCode: number;
  public data: any;
  public message: string;
  public success: boolean;
  public errors: any[];
  public stack?: string;

  constructor(statusCode: number, message: string, data: any = null, success: boolean = false, errors: any[] = [], stack: string = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError }