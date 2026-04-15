export interface IErrorSource {
  path?: string;
  message?: string;
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSources: IErrorSource[];
  error?: any;
  stack?: string | undefined;
}
