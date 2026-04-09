export interface IResponse<T> {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data?: T;
}
