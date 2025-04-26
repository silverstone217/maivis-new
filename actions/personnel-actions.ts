"use server";

import { prisma } from "@/lib/prisma";
import { AddpersonnelSchema } from "@/schema/personnelSchema";
import { hash } from "bcryptjs";
import { z } from "zod";
import { getUser } from "./auth-actions";
import { PersonnelsTypes } from "@/types/personnelTypes";

// Add Personnel
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

// Get Personnels
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
      orderBy: {
        createdAt: "asc",
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

// Get Personnel By ID
export const getPersonnelByIDAction = async (id: string) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour accéder à cette page",
      data: null,
    };
  }

  const PERMISSIONS = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];

  if (!PERMISSIONS.includes(user.role)) {
    return {
      error: true,
      message: "Vous n'avez pas les permissions pour accéder à cette page",
      data: null,
    };
  }

  try {
    const personnel = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        personnelInfo: true,
      },
    });

    if (!personnel) {
      return {
        error: true,
        message: "Personnel non trouvé",
        data: null,
      };
    }

    const personnelData = {
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
      isBanned: personnel.isBanned,
    };
    return {
      error: false,
      message: "Personnel récupéré avec succès",
      data: personnelData as PersonnelsTypes,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Une erreur est survenue lors de la récupération du personnel",
      data: null,
    };
  }
};

// Update Personnel
export const updatePersonnelAction = async (
  id: string,
  formData: AddPersonnelType
) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour modifier un personnel",
    };
  }

  const PERMISSIONS = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];

  if (!PERMISSIONS.includes(user.role)) {
    return {
      error: true,
      message: "Vous n'avez pas les permissions pour modifier un personnel",
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
  } = validatedFields.data;

  const personnelExists = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!personnelExists) {
    return {
      error: true,
      message: "Personnel non trouvé, veuillez vérifier avant de modifier",
    };
  }

  try {
    const personnel = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        email: email,
        gender: gender,
        birthday: birthday,
        telephone: telephone,
        personnelInfo: {
          update: {
            job: job,
            avenue: avenue,
            commune: commune,
            ville: ville,
            province: province,
          },
        },
      },
    });

    return {
      error: false,
      message: "Personnel modifié avec succès",
      data: personnel,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Une erreur est survenue lors de la modification du personnel",
    };
  }
};

// Ban Personnel
export const banOrUnbanPersonnelAction = async (
  id: string,
  isBanned: boolean
) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour bannir un personnel",
    };
  }

  const PERMISSIONS = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];

  if (!PERMISSIONS.includes(user.role)) {
    return {
      error: true,
      message: "Vous n'avez pas les permissions pour bannir un personnel",
    };
  }

  try {
    const isPersonnelExists = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!isPersonnelExists) {
      return {
        error: true,
        message: "Personnel non trouvé, veuillez vérifier avant de bannir",
      };
    }

    const personnel = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isBanned: isBanned,
      },
    });

    return {
      error: false,
      message: "Personnel banni avec succès",
      data: personnel,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Une erreur est survenue lors de la bannissement du personnel",
      data: null,
    };
  }
};

// Delete Personnel
export const deletePersonnelAction = async (id: string) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour supprimer un personnel",
    };
  }

  const PERMISSIONS = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];

  if (!PERMISSIONS.includes(user.role)) {
    return {
      error: true,
      message: "Vous n'avez pas les permissions pour supprimer un personnel",
    };
  }

  try {
    const isPersonnelExists = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!isPersonnelExists) {
      return {
        error: true,
        message: "Personnel non trouvé, veuillez vérifier avant de supprimer",
      };
    }

    const personnel = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return {
      error: false,
      message: "Personnel supprimé avec succès",
      data: personnel,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Une erreur est survenue lors de la suppression du personnel",
      data: null,
    };
  }
};

// Upload Image
export const uploadImageAction = async (id: string, image: string) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour uploader une image",
    };
  }

  const PERMISSIONS = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];

  if (!PERMISSIONS.includes(user.role)) {
    return {
      error: true,
      message: "Vous n'avez pas les permissions pour uploader une image",
    };
  }

  try {
    const isPersonnelExists = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!isPersonnelExists) {
      return {
        error: true,
        message: "Personnel non trouvé, veuillez vérifier avant de modifier",
      };
    }

    const personnel = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        image: image,
      },
    });

    return {
      error: false,
      message: "Image mise à jour avec succès",
      data: personnel,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Une erreur est survenue lors de la mise à jour de l'image",
      data: null,
    };
  }
};
