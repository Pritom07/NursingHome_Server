import { UserRole, UserStatus } from "../../generated/prisma/enums";

export interface ISignUp {
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
