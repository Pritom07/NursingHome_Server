/* eslint-disable @typescript-eslint/no-namespace */
import { NextFunction, Request, Response } from "express";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { config } from "../config";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        email: string;
        emailVerified: boolean;
        role: UserRole;
        status: UserStatus;
        isDeleted: boolean;
      };
    }
  }
}

const checkAuth = (...role: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const sessionToken = cookieUtils.getCookie(
      req,
      "better-auth.session_token",
    );

    if (!sessionToken) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized Access !");
    }

    if (sessionToken) {
      const session = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (session && session?.user) {
        const user = session.user;
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        const createdAt = new Date(session.createdAt);

        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());

          console.log("Session Expiring Soon !");
        }

        if (
          user.status === UserStatus.BLOCK ||
          user.status === UserStatus.DELETED
        ) {
          throw new AppError(status.UNAUTHORIZED, "Unauthorized Access !");
        }

        if (user.isDeleted === true) {
          throw new AppError(status.UNAUTHORIZED, "Unauthorized Access !");
        }

        if (role.length && !role.includes(user.role as UserRole)) {
          throw new AppError(
            status.FORBIDDEN,
            "Forbidden ! You're Not Allowed For This Action",
          );
        }

        req.user = {
          userId: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
          status: user.status,
          isDeleted: user.isDeleted,
        };
      }
    }

    const accessToken = cookieUtils.getCookie(req, "accessToken");

    if (!accessToken) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized Access !");
    }

    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.ACCESS_TOKEN_SECRET,
    ) as JwtPayload;

    if (!verifiedToken) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized Access !");
    }

    const decodedToken = jwtUtils.decodeToken(accessToken) as JwtPayload;

    if (role.length && !role.includes(decodedToken.data?.role as UserRole)) {
      throw new AppError(
        status.FORBIDDEN,
        "Forbidden ! You're Not Allowed For This Action",
      );
    }

    next();
  };
};

export default checkAuth;
