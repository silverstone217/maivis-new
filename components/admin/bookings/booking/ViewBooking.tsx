"use client";
import { JOBS_LIST, STATUS_LIST } from "@/utils/otherData";
import { formatPrice, returnDataValue } from "@/utils/functions";
import {
  bookingWithAlldataType,
  AvailablePersonnelsType,
  StatusType,
} from "@/types/bookings";
import { Button } from "@/components/ui/button";
import SheetComponent from "@/components/SheetComponent";
import Image from "next/image";
import { useState } from "react";
import { assignPersonnelToBooking } from "@/actions/booking-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User2,
  Mail,
  Phone,
  BadgeCheck,
  Calendar,
  CreditCard,
  UserCircle2,
  UserCog,
  UserPlus,
  ArrowRightLeft,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-2 sm:px-4 py-6">
      {/* Booking Info */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <BadgeCheck className="text-primary" size={22} />
            Réservation
            <Badge
              variant="outline"
              className="md:ml-2 truncate max-w-[200px] "
            >
              {bookingData.id}
            </Badge>
            <Badge variant="outline">
              <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Calendar size={16} />
                Créé le : {bookingData.createdAt.toLocaleDateString()}
              </span>
            </Badge>
          </CardTitle>
          {/* hidden */}
          <CardDescription hidden>
            <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Calendar size={16} />
              Créé le : {bookingData.createdAt.toLocaleDateString()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className="capitalize">
              {returnDataValue(bookingData.service, JOBS_LIST)}
            </Badge>
            <Badge
              variant={
                (bookingData.status as StatusType) === "pending"
                  ? "secondary"
                  : (bookingData.status as StatusType) === "cancelled"
                  ? "destructive"
                  : (bookingData.status as StatusType) === "completed"
                  ? "default"
                  : "outline"
              }
              className="capitalize"
            >
              {returnDataValue(bookingData.status, STATUS_LIST)}
            </Badge>
            <Badge variant="outline">{formatPrice(bookingData.price)}</Badge>
            <Badge variant={bookingData.isPaid ? "default" : "destructive"}>
              {bookingData.isPaid ? (
                <CheckCircle2 size={14} className="mr-1" />
              ) : (
                <XCircle size={14} className="mr-1" />
              )}
              {bookingData.isPaid ? "Payé" : "Non payé"}
            </Badge>
          </div>
          <Separator />
          <div className="flex flex-wrap items-center gap-2">
            <Mail size={16} />
            <span className="font-medium break-all">{user.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Client Info */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <User2 size={22} />
            Client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <UserCircle2 size={16} />
            <span className="font-bold capitalize truncate max-w-[180px]">
              {client.name}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Phone size={16} />
            <span className="font-bold truncate max-w-[180px]">
              +{client.telephone}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <MapPin size={16} />
            <span className="font-bold break-all">
              {client.avenue}, {client.ville}, {client.province}{" "}
              {client.codePostal} {client.pays}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Personnel Info */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <UserCog size={22} />
            Personnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {personnel ? (
            <div className="space-y-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <User2 size={16} />
                <span className="font-bold capitalize truncate max-w-[180px]">
                  {personnel.name}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Phone size={16} />
                <span className="font-bold truncate max-w-[180px]">
                  {personnel.telephone}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Mail size={16} />
                <span className="font-bold break-all">{personnel.email}</span>
              </div>
              <div className="flex flex-wrap md:items-center gap-2 mt-2 flex-col md:flex-row">
                <AssignOrChangePersonnel
                  booking={booking}
                  availablePersonnels={availablePersonnels}
                  personnel={
                    availablePersonnels.find(
                      (pers) => pers.id === booking.booking.personnelId
                    ) || null
                  }
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="md:ml-2 w-full md:w-fit"
                >
                  <Trash2 size={16} className="mr-1" />
                  Supprimer le personnel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">
                Personnel non encore assigné
              </span>
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
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <CreditCard size={22} />
            Paiement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{formatPrice(bookingData.price)}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span>Statut :</span>
            <Badge variant={bookingData.isPaid ? "default" : "destructive"}>
              {bookingData.isPaid ? "Payé" : "Non payé"}
            </Badge>
          </div>
          {payment?.paymentId && (
            <div className="flex flex-wrap items-center gap-2">
              <span>ID de paiement :</span>
              <span className="font-bold break-all">{payment.paymentId}</span>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span>Méthode :</span>
            <span className="font-bold capitalize">
              {payment?.paymentMethod || "mpesa"}
            </span>
          </div>
          <Button className="w-full mt-2" disabled={!payment?.paymentId}>
            <CheckCircle2 size={16} className="mr-1" />
            Confirmer le paiement
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <ArrowRightLeft size={22} />
            Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full" variant="outline">
            <ArrowRightLeft size={16} className="mr-1" />
            Changer le statut
          </Button>
          <Button className="w-full" variant="destructive">
            <Trash2 size={16} className="mr-1" />
            Supprimer la réservation
          </Button>
        </CardContent>
      </Card>
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
      const { error, message } = await assignPersonnelToBooking(
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
        <Button disabled={isLoading} variant="outline" size="sm">
          <UserPlus size={16} className="mr-1" />
          {personnel ? "Changer personnel" : "Assigner un personnel"}
        </Button>
      }
      title="Assigner un personnel"
      description={`Assigner un personnel à la réservation N° ${booking.booking.id}`}
      content={
        <div className="flex flex-col gap-2 w-full p-2">
          <h2 className="text-md font-semibold mb-2 text-center">
            Liste des personnels disponibles
          </h2>
          <div className="flex flex-col gap-3 w-full max-h-72 overflow-y-auto pb-2">
            {availablePersonnels.map((pers) => (
              <div
                key={pers.id}
                className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedPersonnel?.id === pers.id
                    ? "bg-primary/10 border-primary"
                    : "border-gray-300 dark:border-gray-700 hover:bg-muted"
                }`}
                onClick={() =>
                  setSelectedPersonnel(
                    selectedPersonnel?.id === pers.id ? null : pers
                  )
                }
              >
                <Image
                  src={pers.image}
                  alt={pers.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-12 h-12 min-w-12 min-h-12"
                  priority
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-bold capitalize truncate max-w-[140px]">
                    {pers.name}
                  </span>
                  <span className="text-xs text-gray-500 break-all">
                    {pers.email}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>
                      {pers.birthDay
                        ? `${
                            new Date().getFullYear() -
                            new Date(pers.birthDay).getFullYear()
                          } ans`
                        : "Âge non dispo"}
                    </span>
                    <span className="capitalize">
                      {pers.gender === "male" ? "Homme" : "Femme"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={handleAssignPersonnel}
            disabled={
              !selectedPersonnel ||
              isLoading ||
              personnel?.id === selectedPersonnel.id
            }
            className="w-full"
          >
            {selectedPersonnel
              ? isLoading
                ? "Assignement en cours..."
                : personnel?.id === selectedPersonnel.id
                ? "Assigné(e)"
                : "Assigner"
              : "Sélectionner un personnel"}
          </Button>
        </div>
      }
    />
  );
};
