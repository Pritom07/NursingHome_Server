import { NextFunction, Request, Response } from "express";
import z from "zod";

const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = zodSchema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
    } else {
      req.body = result.data;
      next();
    }
  };
};

export default validateRequest;
