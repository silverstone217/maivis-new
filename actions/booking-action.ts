"use server";
import { z } from "zod";
import { newBookingSchema } from "@/schema/bookingSchema";
import { getUser } from "./auth-actions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export type NewBookingType = z.infer<typeof newBookingSchema>;

// CREATE BOOKING
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
// MODIFY BOOKING

// GET ALL BOOKINGS
export const getAllBookingsForAdmin = async () => {
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

  const bookings = await prisma.subscription.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      personnel: {
        omit: {
          password: true,
        },
      },
      client: {
        omit: {
          password: true,
        },
      },
      Payment: true,
      bookingUserInfo: true,
    },
  });

  if (!bookings) {
    return {
      error: true,
      message: "Aucune réservation trouvée",
      data: [],
    };
  }
  const bookingsWithPersonnel = bookings.map((booking) => {
    return {
      service: booking.service,
      personnelId: booking.personnelId,
      clientId: booking.clientId,
      debutDate: booking.debutDate,
      createdAt: booking.createdAt,
      price: booking.price,
      isPaid: booking.isPaid,
      status: booking.status,
      clientName: booking.bookingUserInfo?.name,
      personnelName: booking.personnel?.name,
      id: booking.id,
      clientNumber: booking.bookingUserInfo?.telephone,
    };
  });

  return {
    error: false,
    message: "Réservations récupérées avec succès",
    data: bookingsWithPersonnel,
  };
};

// GET BOOKING BY ID
export const getBookingByIdForAdmin = async (id: string) => {
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

  const booking = await prisma.subscription.findUnique({
    where: { id },
  });

  if (!booking) {
    return {
      error: true,
      message: "Réservation non trouvée",
      data: null,
    };
  }

  return {
    error: false,
    message: "Réservation récupérée avec succès",
    data: booking,
  };
};

// GET BOOKING CLIENT INFO
export const getBookingClientInfo = async (id: string) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour accéder à cette page",
      data: null,
    };
  }

  const booking = await prisma.subscription.findUnique({
    where: { id },
    include: {
      client: {
        omit: {
          password: true,
        },
      },
    },
  });

  if (!booking) {
    return {
      error: true,
      message: "Réservation non trouvée",
      data: null,
    };
  }

  return {
    error: false,
    message: "Réservation récupérée avec succès",
    data: booking.client,
  };
};

// GET BOOKING PERSONNEL INFO
export const getBookingPersonnelInfo = async (id: string) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour accéder à cette page",
      data: null,
    };
  }

  const booking = await prisma.subscription.findUnique({
    where: { id },
    include: {
      personnel: {
        omit: {
          password: true,
        },
      },
    },
  });

  if (!booking) {
    return {
      error: true,
      message: "Réservation non trouvée",
      data: null,
    };
  }

  return {
    error: false,
    message: "Réservation récupérée avec succès",
    data: booking.personnel,
  };
};

// GET BOOKING PAYMENT INFO
export const getBookingPaymentInfo = async (id: string) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour accéder à cette page",
      data: null,
    };
  }

  const booking = await prisma.subscription.findUnique({
    where: { id },
    include: {
      Payment: true,
    },
  });

  if (!booking) {
    return {
      error: true,
      message: "Réservation non trouvée",
      data: null,
    };
  }

  return {
    error: false,
    message: "Réservation récupérée avec succès",
    data: booking.Payment,
  };
};

// GET BOOKING USER INFO
export const getBookingUserInfo = async (id: string) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message: "Vous devez être connecté pour accéder à cette page",
      data: null,
    };
  }

  const booking = await prisma.subscription.findUnique({
    where: { id },
    include: {
      bookingUserInfo: true,
    },
  });

  if (!booking) {
    return {
      error: true,
      message: "Réservation non trouvée",
      data: null,
    };
  }

  return {
    error: false,
    message: "Réservation récupérée avec succès",
    data: booking.bookingUserInfo,
  };
};

// GET PERSONNELS BY SERVICE
export const getPersonnelsByServiceForAdmin = async (service: string) => {
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

  const personnels = await prisma.personnelInfo.findMany({
    where: { job: service },
    include: {
      personnel: {
        omit: {
          password: true,
        },
      },
    },
  });

  const personnelsData = personnels.map((personnel) => {
    return {
      id: personnel.personnel.id,
      name: personnel.personnel.name,
      job: personnel.job,
      image: personnel.personnel.image,
      email: personnel.personnel.email,
      telephone: personnel.personnel.telephone,
      isBanned: personnel.personnel.isBanned,
      role: personnel.personnel.role,
      gender: personnel.personnel.gender,
      birthDay: personnel.personnel.birthday,
      avenue: personnel.avenue,
      ville: personnel.ville,
      province: personnel.province,
      codePostal: personnel.codePostal,
      pays: personnel.pays,
      createdAt: personnel.personnel.createdAt,
      updatedAt: personnel.personnel.updatedAt,
    };
  });

  return {
    error: false,
    message: "Personnels récupérés avec succès",
    data: personnelsData,
  };
};

// ASSIGN PERSONNEL TO BOOKING
export const assignPersonnelToBooking = async (
  bookingId: string,
  personnelId: string
) => {
  const user = await getUser();

  if (!user) {
    return {
      error: true,
      message:
        "Vous devez être connecté pour assigner un personnel à une réservation",
      data: null,
    };
  }

  const PERMISSIONS = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];

  if (!PERMISSIONS.includes(user.role)) {
    return {
      error: true,
      message:
        "Vous n'avez pas les permissions pour assigner un personnel à une réservation",
      data: null,
    };
  }

  const isBookingAvailable = await prisma.subscription.findUnique({
    where: { id: bookingId },
  });

  if (!isBookingAvailable) {
    return {
      error: true,
      message: "Réservation non trouvée",
      data: null,
    };
  }

  const isPersonnelAvailable = await prisma.user.findUnique({
    where: { id: personnelId },
  });

  if (!isPersonnelAvailable) {
    return {
      error: true,
      message: "Personnel non trouvé",
      data: null,
    };
  }

  const booking = await prisma.subscription.update({
    where: { id: bookingId },
    data: { personnelId },
  });

  if (!booking) {
    return {
      error: true,
      message: "Erreur lors de l'assignation du personnel à la réservation",
      data: null,
    };
  }

  return {
    error: false,
    message: "Personnel assigné à la réservation avec succès",
    data: booking,
  };
};
