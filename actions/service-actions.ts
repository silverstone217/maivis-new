"use server";

import { prisma } from "@/lib/prisma";
import { AddServiceSchema } from "@/schema/servicesSchema";
import { z } from "zod";
import { getUser } from "./auth-actions";
// Add Service
export type AddServiceType = z.infer<typeof AddServiceSchema>;

export const addServiceAction = async (formData: AddServiceType) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour ajouter un service",
    };
  }

  const PERMISSIONS = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];

  if (!PERMISSIONS.includes(user.role)) {
    return {
      error: true,
      message: "Vous n'avez pas les permissions pour ajouter un service",
    };
  }

  const validatedFields = AddServiceSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: true,
      message: "Veuillez remplir tous les champs",
    };
  }

  const { service, description, price, image } = validatedFields.data;

  try {
    const isServiceExist = await prisma.service.findUnique({
      where: {
        service,
      },
    });

    if (isServiceExist) {
      return {
        error: true,
        message: "Ce service existe déjà! Veuillez utiliser un autre nom",
      };
    }

    const newService = await prisma.service.create({
      data: {
        service,
        description,
        price,
        image,
      },
    });

    return {
      error: false,
      message: "Service ajouté avec succès",
      data: newService,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Une erreur est survenue lors de l'ajout du service",
    };
  }
};
