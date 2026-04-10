export interface ISignIn {
  email: string;
  password: string;
  rememberMe?: boolean;
  callbackURL?: string;
}
