import { Gender, UserRole } from "../../generated/prisma/enums";
import { config } from "../config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedSuperAdmin = async () => {
  try {
    const superAdminExist = await prisma.user.findFirst({
      where: { role: UserRole.SUPER_ADMIN },
    });

    if (superAdminExist) {
      console.log("Super_Admin already exist. Skipping...");
      return;
    }

    const superAdminData = await auth.api.signUpEmail({
      body: {
        name: "Super_Pritom",
        email: config.SUPER_ADMIN_EMAIL,
        password: config.SUPER_ADMIN_PASS,
        role: UserRole.SUPER_ADMIN,
        needPasswordChange: false,
        rememberMe: false,
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { email: config.SUPER_ADMIN_EMAIL },
        data: {
          emailVerified: true,
        },
      });

      await tx.admin.create({
        data: {
          user_id: superAdminData.user.id,
          name: "Super_Pritom",
          email: config.SUPER_ADMIN_EMAIL,
          address: "Chattogram",
          gender: Gender.MALE,
        },
      });

      console.log("Super_Admin Created Successfully");
    });
  } catch (err: any) {
    console.log("Error Occured", err.message);

    await prisma.user.delete({
      where: { email: config.SUPER_ADMIN_EMAIL },
    });
  }
};
