"use server";

import { prisma } from "@/lib/prisma";
import { AddpersonnelSchema } from "@/schema/personnelSchema";
import { hash } from "bcryptjs";
import { z } from "zod";
import { getUser } from "./auth-actions";
import { PersonnelsTypes } from "@/types/personnelTypes";

export type AddPersonnelType = z.infer<typeof AddpersonnelSchema>;

export const addPersonnelAction = async (formData: AddPersonnelType) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour ajouter un personnel",
    };
  }

  const PERMISSIONS = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];

  if (!PERMISSIONS.includes(user.role)) {
    return {
      error: true,
      message: "Vous n'avez pas les permissions pour ajouter un personnel",
    };
  }

  const validatedFields = AddpersonnelSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      error: true,
      message: "Veuillez remplir tous les champs",
    };
  }

  const {
    name,
    job,
    avenue,
    commune,
    ville,
    province,
    telephone,
    email,
    gender,
    birthday,
    numero,
    codePostal,
    pays,
  } = validatedFields.data;

  try {
    const personnelExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (personnelExists) {
      return {
        error: true,
        message:
          "Cette adresse email est déjà utilisée, aller sur la page de modification pour modifier les informations",
      };
    }

    const password = "123456";
    const hashedPassword = await hash(password, 10);

    const personnel = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: "PERSONNEL",
        gender: gender,
        birthday: birthday,
        telephone: telephone,
        personnelInfo: {
          create: {
            job: job,
            avenue: avenue,
            commune: commune,
            ville: ville,
            province: province,
            codePostal: codePostal ?? undefined,
            pays: pays,
          },
        },
      },
    });

    return {
      error: false,
      message: "Personnel ajouté avec succès",
      data: personnel,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Une erreur est survenue lors de l'ajout du personnel",
    };
  }
};

export const getPersonnelsAction = async () => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour accéder à cette page",
      data: [],
    };
  }

  const PERMISSIONS = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];

  if (!PERMISSIONS.includes(user.role)) {
    return {
      error: true,
      message: "Vous n'avez pas les permissions pour accéder à cette page",
      data: [],
    };
  }

  try {
    const personnels = await prisma.user.findMany({
      where: {
        role: "PERSONNEL",
      },
      include: {
        personnelInfo: true,
      },
    });

    const personnelData = personnels.map((personnel) => ({
      id: personnel.id,
      name: personnel.name,
      email: personnel.email,
      job: personnel.personnelInfo?.job,
      avenue: personnel.personnelInfo?.avenue,
      commune: personnel.personnelInfo?.commune,
      ville: personnel.personnelInfo?.ville,
      province: personnel.personnelInfo?.province,
      codePostal: personnel.personnelInfo?.codePostal,
      pays: personnel.personnelInfo?.pays,
      telephone: personnel.telephone,
      gender: personnel.gender,
      birthday: personnel.birthday,
      image: personnel.image,
      createdAt: personnel.createdAt,
      updatedAt: personnel.updatedAt,
      role: personnel.role,
    }));

    return {
      error: false,
      message: "Personnels récupérés avec succès",
      data: personnelData as PersonnelsTypes[],
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Une erreur est survenue lors de la récupération des personnels",
      data: [],
    };
  }
};
