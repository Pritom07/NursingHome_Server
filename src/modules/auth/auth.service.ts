import { UserStatus } from "../../../generated/prisma/enums";
import { ISignIn } from "../../interfaces/signInUser";
import { ISignUp } from "../../interfaces/signUpUser";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

const signUp = async (payLoad: ISignUp) => {
  const res = await auth.api.signUpEmail({
    body: payLoad,
  });

  return res;
};

const signIn = async (payLoad: ISignIn) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payLoad.email },
  });

  if (!isExist) {
    throw new Error("User Not Exist");
  }

  if (isExist && isExist.status === UserStatus.BLOCK) {
    throw new Error("User is BLOCKED");
  }

  if (
    isExist &&
    (isExist.isDeleted === true || isExist.status === UserStatus.DELETED)
  ) {
    throw new Error("User is DELETED");
  }

  const res = await auth.api.signInEmail({
    body: payLoad,
  });

  return res;
};

export const authService = { signUp, signIn };
