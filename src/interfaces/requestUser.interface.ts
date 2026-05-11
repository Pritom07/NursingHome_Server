import { UserRole, UserStatus } from "../../generated/prisma/enums";

export interface IRequestUser {
  userId: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  isDeleted: boolean;
}
