import React from "react";
import { redirect } from "next/navigation";
import {
  getBookingByIdForAdmin,
  getBookingClientInfo,
  getBookingPersonnelInfo,
  getBookingPaymentInfo,
  getBookingUserInfo,
  getPersonnelsByServiceForAdmin,
} from "@/actions/booking-action";
import {
  AvailablePersonnelsType,
  bookingWithAlldataType,
} from "@/types/bookings";
import ViewBooking from "@/components/admin/bookings/booking/ViewBooking";
interface BookingDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const { id } = await params;

  if (!id) {
    return redirect("/gestion-reservations");
  }

  const {
    data: bookingData,
    error: bookingError,
    message: bookingMessage,
  } = await getBookingByIdForAdmin(id);
  const {
    data: clientData,
    error: clientError,
    message: clientMessage,
  } = await getBookingClientInfo(id);
  const {
    data: personnelData,
    error: personnelError,
    message: personnelMessage,
  } = await getBookingPersonnelInfo(id);
  const {
    data: paymentData,
    error: paymentError,
    message: paymentMessage,
  } = await getBookingPaymentInfo(id);
  const {
    data: userData,
    error: userError,
    message: userMessage,
  } = await getBookingUserInfo(id);

  const error =
    bookingError || clientError || personnelError || paymentError || userError;
  const message =
    bookingMessage ||
    clientMessage ||
    personnelMessage ||
    paymentMessage ||
    userMessage;

  const data: bookingWithAlldataType = {
    booking: bookingData,
    client: userData,
    personnel: personnelData,
    user: clientData,
    payment: paymentData,
  } as bookingWithAlldataType;

  if (error) {
    return <div className="text-red-500">{message}</div>;
  }
  if (!data) {
    return <div className="text-red-500">{message}</div>;
  }

  const booking = data;
  const AvailablePersonnels = await getPersonnelsByServiceForAdmin(
    booking.booking.service
  );

  const availablePersonnels =
    AvailablePersonnels.data as AvailablePersonnelsType[];

  return (
    <div className="flex flex-col gap-4">
      <ViewBooking
        booking={booking}
        availablePersonnels={availablePersonnels}
      />
    </div>
  );
}

export default BookingDetailsPage;
