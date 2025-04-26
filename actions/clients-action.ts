"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "./auth-actions";

export const getClientsAction = async () => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour accéder à cette page",
    };
  }

  const PERMISSIONS = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];

  if (!PERMISSIONS.includes(user.role)) {
    return {
      error: true,
      message: "Vous n'avez pas les permissions pour accéder à cette page",
    };
  }

  try {
    const clients = await prisma.user.findMany({
      where: {
        role: {
          in: ["CLIENT", "USER"],
        },
      },
    });

    const clientData = clients.map((client) => {
      const { password, ...rest } = client;
      return rest;
    });

    return {
      error: false,
      message: "Clients récupérés avec succès",
      data: clientData,
    };
  } catch (error) {
    return {
      error: true,
      message: "Une erreur est survenue lors de la récupération des clients",
    };
  }
};
