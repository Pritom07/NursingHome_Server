import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  PORT: process.env.PORT,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
};

export default config;
