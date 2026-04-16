import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payLoad: JwtPayload,
  secret: string,
  { expiresIn }: SignOptions,
) => {
  const token = jwt.sign(payLoad, secret, { expiresIn } as SignOptions);
  return token;
};

const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;
  return decoded;
};

const decodeToken = (token: string) => {
  const decoded = jwt.decode(token);
  return decoded;
};

export const jwtUtils = { createToken, verifyToken, decodeToken };
