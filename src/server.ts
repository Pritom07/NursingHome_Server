import app from "./app";
import { config } from "./config";
import { prisma } from "./lib/prisma";

const main = async () => {
  try {
    const PORT = config.PORT;
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`App Running On Port : ${PORT}`);
    });
  } catch (err: any) {
    await prisma.$disconnect();
    console.log(err);
    process.exit(1);
  }
};

main();
