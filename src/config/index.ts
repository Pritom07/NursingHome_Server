import dotenv from "dotenv";
import path from "path";
import { IEnvConfig } from "../interfaces/envConfig.interface";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const loadEnvVars = (): IEnvConfig => {
  const requiredEnvVars = [
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
  ];

  requiredEnvVars.forEach((value) => {
    if (!process.env[value]) {
      throw new Error(`${process.env[value]} is required but not in .env file`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
  };
};

export const config = loadEnvVars();
