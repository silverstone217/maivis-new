"use client";
import { JOBS_LIST, STATUS_LIST } from "@/utils/otherData";
import { formatPrice, returnDataValue } from "@/utils/functions";
import {
  bookingWithAlldataType,
  AvailablePersonnelsType,
} from "@/types/bookings";
import { Button } from "@/components/ui/button";
import SheetComponent from "@/components/SheetComponent";
import Image from "next/image";
import { useState } from "react";
import { assignPersonnelToBooking } from "@/actions/booking-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface ViewBookingProps {
  booking: bookingWithAlldataType;
  availablePersonnels: AvailablePersonnelsType[];
}

export default function ViewBooking({
  booking,
  availablePersonnels,
}: ViewBookingProps) {
  const { personnel, user, client, booking: bookingData, payment } = booking;

  return (
    <div className="flex flex-col gap-4">
      {/* booking info */}
      <div>
        <h1 className="text-2xl font-bold">Réservation</h1>
        <p>ID: {bookingData.id}</p>
        <p className="text-sm text-gray-500">
          Créé le: {bookingData.createdAt.toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500 capitalize">
          Service: {returnDataValue(bookingData.service, JOBS_LIST)}
        </p>
        <p className="text-sm text-gray-500 capitalize">
          Status: {returnDataValue(bookingData.status, STATUS_LIST)}
        </p>
        <p className="text-sm text-gray-500 capitalize">
          Prix: {formatPrice(bookingData.price)}
        </p>
        <p className="text-sm text-gray-500 capitalize">
          Souscrivant: {user.email}
        </p>
      </div>

      {/* client info */}
      <div className=" p-4 border border-gray-200 rounded-lg dark:border-gray-700 capitalize">
        <h2 className="text-xl font-bold mb-2  ">Client</h2>
        <p>
          <span className="">Nom:</span>{" "}
          <span className="font-bold"> {client.name}</span>
        </p>
        <p>
          <span className="">Téléphone:</span>{" "}
          <span className="font-bold"> +(234){client.telephone}</span>
        </p>
        <p>
          <span className="">Adresse:</span>{" "}
          <span className="font-bold">
            {client.avenue} {client.ville} {client.province}
            {client.codePostal} {client.pays}
          </span>
        </p>
      </div>

      {/* personnel info Hire or Manage */}
      <div className=" p-4 border border-gray-200 rounded-lg dark:border-gray-700 capitalize">
        <h2 className="text-xl font-bold mb-2  ">Personnel</h2>
        <div>
          {personnel ? (
            <div className="flex flex-col gap-2">
              <p>
                <span>Nom:</span>{" "}
                <span className="font-bold"> {personnel.name}</span>
              </p>
              <p>
                <span>Téléphone:</span>{" "}
                <span className="font-bold"> {personnel.telephone}</span>
              </p>
              <p>
                <span>Email:</span>{" "}
                <span className="font-bold"> {personnel.email}</span>
              </p>
              <div className="flex items-center gap-2 w-full">
                {/* assign or change personnel */}
                <AssignOrChangePersonnel
                  booking={booking}
                  availablePersonnels={availablePersonnels}
                  personnel={
                    availablePersonnels.find(
                      (pers) => pers.id === booking.booking.personnelId
                    ) || null
                  }
                />

                {/* delete personnel */}
                <Button className="" variant="destructive">
                  <span>Supprimer le personnel</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">
                Personnel non encore assigné
              </p>
              <AssignOrChangePersonnel
                booking={booking}
                availablePersonnels={availablePersonnels}
                personnel={
                  availablePersonnels.find(
                    (pers) => pers.id === booking.booking.personnelId
                  ) || null
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Payment info */}
      <div className=" p-4 border border-gray-200 rounded-lg dark:border-gray-700 capitalize">
        <h2 className="text-xl font-bold mb-2  ">Paiement</h2>
        <p>
          <span>Montant:</span>{" "}
          <span className="font-bold"> {formatPrice(bookingData.price)}</span>
        </p>
        <p>
          <span>Statut de paiement:</span>{" "}
          <span className="font-bold">
            {bookingData.isPaid ? "Payé" : "Non payé"}
          </span>
        </p>

        {payment && payment.paymentId && (
          <p>
            <span>ID de paiement:</span>
            <span className="font-bold">{payment.paymentId}</span>
          </p>
        )}
        <p>
          <span>Méthode de paiement:</span>
          <span className="font-bold">
            {" "}
            {payment && payment.paymentMethod ? payment.paymentMethod : "mpesa"}
          </span>
        </p>

        {/* Confirmation de paiement */}
        <Button className="w-full mt-2" disabled={!payment?.paymentId}>
          <span>Confirmer le paiement</span>
        </Button>
      </div>

      {/* STATUS, DELETE, EDIT */}
      <div className=" p-4 border border-gray-200 rounded-lg dark:border-gray-700 capitalize">
        <h2 className="text-xl font-bold mb-2  ">Actions</h2>

        {/* status */}
        <Button className="w-full mt-2">
          <span>Changer le statut</span>
        </Button>

        {/* delete booking */}
        <Button className="w-full mt-2" variant="destructive">
          <span>Supprimer la réservation</span>
        </Button>
      </div>
    </div>
  );
}

const AssignOrChangePersonnel = ({
  booking,
  availablePersonnels,
  personnel,
}: {
  booking: bookingWithAlldataType;
  availablePersonnels: AvailablePersonnelsType[];
  personnel: AvailablePersonnelsType | null;
}) => {
  const [selectedPersonnel, setSelectedPersonnel] =
    useState<AvailablePersonnelsType | null>(personnel || null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAssignPersonnel = async () => {
    setIsLoading(true);
    try {
      if (!booking.booking.id || !selectedPersonnel?.id) {
        toast.error("Réservation ou personnel non trouvé");
        return;
      }

      const { error, message, data } = await assignPersonnelToBooking(
        booking.booking.id,
        selectedPersonnel.id
      );
      if (error) {
        toast.error(message);
        return;
      }
      toast.success(message);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de l'assignation du personnel");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <SheetComponent
      trigger={
        <Button disabled={isLoading}>
          <span>
            {personnel ? "Changer personnel" : "Assigner un personnel"}
          </span>
        </Button>
      }
      title="Assigner un personnel"
      description={`Assigner un personnel à la réservation N° ${booking.booking.id}`}
      content={
        <div className="flex flex-col gap-4 w-full p-4 border-y border-gray-200 dark:border-gray-700">
          {/* title */}
          <h2 className="text-md font-bold">
            Liste des personnels disponibles
          </h2>

          {/* list of personnels */}
          <div className="flex flex-col gap-4 w-full">
            {availablePersonnels.map((pers) => (
              <div
                key={pers.id}
                className="w-full"
                onClick={() => {
                  if (selectedPersonnel?.id === pers.id) {
                    setSelectedPersonnel(null);
                  } else {
                    setSelectedPersonnel(pers);
                  }
                }}
              >
                <div
                  className={`grid grid-cols-2 gap-2  border w-full 
                border-gray-300 rounded-lg dark:border-gray-700
                hover:bg-gray-300 dark:hover:bg-gray-800
                transition-all duration-500 ease-in-out cursor-pointer
                ${
                  selectedPersonnel?.id === pers.id
                    ? "bg-gray-200 dark:bg-gray-800"
                    : ""
                }`}
                >
                  <Image
                    src={pers.image}
                    alt={pers.name}
                    width={200}
                    height={200}
                    className="w-full h-24 object-cover"
                    priority
                  />
                  <div className="flex flex-col items-start p-2 ">
                    <span className="font-bold capitalize">{pers.name}</span>
                    <span className="text-xs text-gray-500">{pers.email}</span>
                    {/* age */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">
                        {pers.birthDay
                          ? new Date().getFullYear() -
                            new Date(pers.birthDay).getFullYear() +
                            " ans"
                          : "Age non disponible"}
                      </span>
                      {/* gender */}
                      <span className="text-sm text-gray-500 capitalize">
                        {pers.gender === "male" ? "Homme" : "Femme"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* assign button */}
          <Button
            onClick={handleAssignPersonnel}
            disabled={!selectedPersonnel}
            className="w-full"
          >
            {selectedPersonnel ? (
              isLoading ? (
                <span>Assignement en cours...</span>
              ) : (
                "Assigner"
              )
            ) : (
              "Sélectionner un personnel"
            )}
          </Button>
        </div>
      }
    />
  );
};
