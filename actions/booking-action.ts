"use server";
import { z } from "zod";
import { newBookingSchema } from "@/schema/bookingSchema";
import { getUser } from "./auth-actions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export type NewBookingType = z.infer<typeof newBookingSchema>;

export const createBooking = async (formData: NewBookingType) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour effectuer une réservation",
    };
  }

  if (user.isBanned) {
    return {
      error: true,
      message:
        "Votre compte a été suspendu, veuillez contacter l'administrateur",
    };
  }

  const validatedFields = newBookingSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      error: true,
      message: "Veuillez remplir tous les champs",
      data: null,
      errorFields: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    service,
    personnelId,
    clientId,
    debutDate,
    // debutTime,
    offDay,
    isStayingAtHome,
    isDayOff,
    price,
    duration,
    bookingUserInfo,
  } = validatedFields.data;

  const isPersonnelAvailable = await prisma.personnelInfo.findMany({
    where: { job: service },
  });

  if (isPersonnelAvailable.length < 1) {
    return {
      error: true,
      message:
        "Aucun personnel n'est disponible pour ce service, veuillez ressayer plus tard!",
      data: null,
    };
  }
  try {
    const booking = await prisma.subscription.create({
      data: {
        service,
        personnelId,
        clientId,
        debutDate,
        // debutTime,
        offDay,
        isStayingAtHome,
        isDayOff,
        price,
        duration,
        bookingUserInfo: {
          create: {
            ...bookingUserInfo,
          },
        },
      },
    });

    if (!booking) {
      return {
        error: true,
        message:
          "Une erreur est survenue lors de la création de la réservation",
      };
    }

    revalidatePath("/services");
    return {
      error: false,
      message: "Réservation créée avec succès",
      data: booking,
    };
  } catch (error) {
    return {
      error: true,
      message: "Une erreur est survenue lors de la création de la réservation",
    };
  }
};
