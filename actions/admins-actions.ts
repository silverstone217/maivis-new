"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "./auth-actions";

// get all admins
export const getAdminsAction = async () => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour accéder à cette page",
    };
  }

  const PERMISSIONS = ["SUPER_ADMIN", "ADMIN"];

  if (!PERMISSIONS.includes(user.role)) {
    return {
      error: true,
      message: "Vous n'avez pas les permissions pour accéder à cette page",
    };
  }

  try {
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "SUPER_ADMIN", "MODERATOR"],
        },
      },
    });

    const adminData = admins.map((admin) => {
      const { password, ...rest } = admin;
      return rest;
    });

    return {
      error: false,
      message: "Administrateurs récupérés avec succès",
      data: adminData,
    };
  } catch (error) {
    return {
      error: true,
      message: "Une erreur est survenue lors de la récupération des admins",
    };
  }
};
