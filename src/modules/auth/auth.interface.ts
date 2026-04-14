import { UserRole, UserStatus } from "../../../generated/prisma/enums";

export interface IRegisterPatient {
  id?: string;
  name: string;
  email: string;
  password: string;
  emailVerified?: boolean;
  image?: string;
  role?: UserRole;
  status?: UserStatus;
  needPasswordChange?: boolean;
  isDeleted?: boolean;
  deletedAt?: Date;
  callbackURL?: string;
}

export interface ISignIn {
  email: string;
  password: string;
  rememberMe?: boolean;
  callbackURL?: string;
}
