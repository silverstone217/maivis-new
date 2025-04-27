import { User, Subscription, Payment, BookingUserInfo } from "@prisma/client";

export type bookingsWithPersonnelAdminType = {
  service: string;
  personnelId: string | null;
  clientId: string;
  debutDate: Date;
  createdAt: Date;
  price: number;
  isPaid: boolean;
  status: string;
  clientName: string | undefined;
  personnelName: string | undefined;
  id: string;
  clientNumber: string | undefined;
};

export type bookingWithAlldataType = {
  booking: Subscription;
  client: BookingUserInfo;
  personnel: User;
  payment: Payment | null;
  user: User;
};

export type AvailablePersonnelsType = {
  id: string;
  name: string;
  job: string;
  image: string;
  email: string;
  telephone: string;
  isBanned: boolean;
  role: string;
  gender: string;
  birthDay: Date;
  avenue: string;
  ville: string;
  province: string;
  codePostal: string;
  pays: string;
  createdAt: Date;
  updatedAt: Date;
  personnelId: string;
};
