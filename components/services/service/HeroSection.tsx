"use client";
import { createBooking, NewBookingType } from "@/actions/booking-action";
import SheetComponent from "@/components/SheetComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGetUser from "@/hooks/useGetUser";
import { ServiceType } from "@/types/service";
import { formatPrice, isEmptyString, returnDataValue } from "@/utils/functions";
import { DAY_LIST, DURATION_LIST } from "@/utils/otherData";
import { CalendarDays, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type HeroSectionProps = {
  service: ServiceType;
  personnelsLength: number;
};

export function HeroSection({ service, personnelsLength }: HeroSectionProps) {
  return (
    <section
      className="relative bg-white dark:bg-gray-900 py-16 px-6 md:px-12 flex 
    flex-col md:flex-row items-center max-w-7xl mx-auto rounded-lg shadow 
    "
    >
      {/* Image */}
      <div className="relative w-full md:w-1/2 h-64 md:h-96 rounded-lg overflow-hidden shadow-md mb-8 md:mb-0">
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="md:ml-12 flex flex-col flex-1 max-w-xl">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          {service.name}
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {service.description}
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <Badge variant="outline" className="flex items-center gap-2">
            <Users size={18} />
            {personnelsLength}{" "}
            {personnelsLength > 1 ? "personnels" : "personnel"}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <CalendarDays size={18} />
            {service.duration}
          </Badge>
          {service.stayHome && (
            <Badge variant="outline" className="flex items-center gap-2">
              <MapPin size={18} />
              {service.stayHome && "Peut dormir chez vous"}
            </Badge>
          )}
        </div>

        <SubscribeToService
          personnelsLength={personnelsLength}
          service={service}
        />
      </div>
    </section>
  );
}

const canGetDayOff = ["monthly", "weekly", "daily"];

const SubscribeToService = ({
  service,
  personnelsLength,
}: {
  service: ServiceType;
  personnelsLength: number;
}) => {
  const { user } = useGetUser();
  const [avenue, setAvenue] = useState("");
  const [commune, setCommune] = useState("");
  const [ville, setVille] = useState("");
  const [province, setProvince] = useState("Kinshasa");
  //   const [codePostal, setCodePostal] = useState("");
  //   const [pays, setPays] = useState("");
  const [telephone, setTelephone] = useState(user?.telephone || "");
  const [name, setName] = useState(user?.name || "");
  const [offDay, setOffDay] = useState<string[]>([]);
  const [isStayingAtHome, setIsStayingAtHome] = useState(false);
  const [debutDate, setDebutDate] = useState("");
  //   const [debutTime, setDebutTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const isDayOff = useMemo(() => {
    return canGetDayOff.includes(service.duration);
  }, [service.duration]);

  const isDisabledBtn = useMemo(() => {
    if (isLoading) return true;
    if (isEmptyString(name)) return true;
    if (isEmptyString(telephone)) return true;
    if (isEmptyString(avenue)) return true;
    if (isEmptyString(commune)) return true;
    if (isEmptyString(ville)) return true;
    if (isEmptyString(province)) return true;
    if (isEmptyString(debutDate)) return true;
    // if (isEmptyString(debutTime)) return true;
    if (offDay.length === 0 && isDayOff) return true;
    return false;
  }, [
    isLoading,
    name,
    telephone,
    avenue,
    commune,
    ville,
    province,
    debutDate,
    // debutTime,
    offDay,
    isDayOff,
  ]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData: NewBookingType = {
        service: service.service,
        bookingUserInfo: {
          name: name.trim().toLowerCase(),
          telephone: telephone.trim(),
          avenue: avenue.trim().toLowerCase(),
          commune: commune.trim().toLowerCase(),
          ville: ville.trim().toLowerCase(),
          province: province.trim().toLowerCase(),
        },
        clientId: user.id,
        debutDate: new Date(debutDate),
        // debutTime: new Date(debutTime),
        isStayingAtHome,
        offDay,
        isDayOff,
        price: service.price,
        duration: service.duration,
      };

      //   console.log(formData);

      const { error, message, data } = await createBooking(formData);

      if (error) {
        toast.error(message);
        return;
      }

      toast.success(message);
      router.push(`/services/${service.service}`);

      setAvenue("");
      setCommune("");
      setVille("");
      setProvince("Kinshasa");
      setTelephone(user.telephone || "");
      setName(user.name || "");
      setDebutDate("");
      setOffDay([]);
      setIsStayingAtHome(false);
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la souscription");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <SheetComponent
      trigger={
        <Button className="w-full lg:w-fit py-6 cursor-pointer">
          <span className="font-bold">Souscrire a ce service</span>
          <span className="text-md font-bold">
            {formatPrice(service.price)}
          </span>
        </Button>
      }
      title={`${service.name}`}
      description={`${service.description}`}
      content={
        <div className="flex flex-col gap-2 px-4 border-t py-4">
          {/* form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* name */}
            <div className="grid w-full items-center gap-1.5">
              <Label>Prenom et Nom</Label>
              <Input
                type="text"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full"
                autoCapitalize="off"
                autoComplete="name"
                autoCorrect="off"
                spellCheck="false"
                disabled={isLoading}
                minLength={3}
                maxLength={60}
              />
            </div>

            {/* telephone */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="telephone">Telephone</Label>
              <div className="relative w-full">
                <span className="text-sm font-medium absolute left-2 top-1/2 -translate-y-1/2 border-r border-gray-300 pr-2">
                  +243
                </span>
                <Input
                  type="tel"
                  id="telephone"
                  defaultValue={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full pl-14"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  minLength={9}
                  maxLength={9}
                  placeholder="970000000"
                />
              </div>
            </div>
            {/* avenue */}
            <div className="grid w-full items-center gap-1.5">
              <Label>Numero et Avenue</Label>
              <Input
                type="text"
                value={avenue}
                onChange={(e) => setAvenue(e.target.value)}
                placeholder="123 rue de la paix"
                required
                className="w-full"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                disabled={isLoading}
                minLength={3}
                maxLength={60}
              />
            </div>

            {/* commune */}
            <div className="grid w-full items-center gap-1.5">
              <Label>Commune</Label>
              <Input
                type="text"
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                placeholder="Gombe"
                required
                className="w-full"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                disabled={isLoading}
                minLength={3}
                maxLength={60}
              />
            </div>

            {/* ville */}
            <div className="grid w-full items-center gap-1.5">
              <Label>Ville</Label>
              <Input
                type="text"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="Kinshasa"
                required
                className="w-full"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                disabled={isLoading}
                minLength={3}
                maxLength={60}
              />
            </div>

            {/* province */}
            <div className="grid w-full items-center gap-1.5">
              <Label>Province</Label>
              <Input
                type="text"
                defaultValue={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Kinshasa"
                required
                className="w-full"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                disabled={isLoading}
                minLength={3}
                maxLength={60}
              />
            </div>

            {/* off day */}
            {isDayOff && (
              <div className="grid w-full items-center gap-1.5">
                <Label>Jour de repos</Label>
                <div className="flex flex-wrap gap-2">
                  {DAY_LIST.map((day) => (
                    <Button
                      key={day.value}
                      variant="outline"
                      size="sm"
                      type="button"
                      className={`${
                        offDay.includes(day.value)
                          ? "bg-blue-500 text-white dark:bg-blue-500"
                          : ""
                      } cursor-pointer`}
                      onClick={() =>
                        setOffDay(
                          offDay.includes(day.value)
                            ? offDay.filter((d) => d !== day.value)
                            : [...offDay, day.value]
                        )
                      }
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {offDay.length > 0
                    ? offDay.length + " jour(s) de repos"
                    : "Aucun jour de repos"}
                </p>
              </div>
            )}

            {/* is staying at home */}
            {isDayOff && (
              <div className="grid w-full items-center gap-1.5">
                <Label>
                  Est-ce que le personnel va rester chez vous à la maison ?
                </Label>
                <Checkbox
                  checked={isStayingAtHome}
                  onCheckedChange={() => setIsStayingAtHome(!isStayingAtHome)}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* debut */}
            <div className="grid w-full items-center gap-1.5">
              <Label>Date et heure de debut</Label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={debutDate}
                  onChange={(e) => setDebutDate(e.target.value)}
                  required
                  className="w-full"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  disabled={isLoading}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {/* <Input
                  type="time"
                  value={debutTime}
                  onChange={(e) => setDebutTime(e.target.value)}
                  required
                  className="w-full"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  disabled={isLoading}
                  min="00:00"
                  max="23:59"
                  step="60"
                /> */}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isDisabledBtn}
              className="w-full py-6 font-bold"
            >
              {isLoading ? (
                <span>En cours...</span>
              ) : (
                <p className="flex items-center gap-2">
                  <span>Souscrire</span>
                  <span>{formatPrice(service.price)}</span>
                  <span>
                    par {returnDataValue(service.duration, DURATION_LIST)}
                  </span>
                </p>
              )}
            </Button>

            {/* Personnels length */}
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="flex items-center gap-2">
                <Users size={18} />
                {personnelsLength}{" "}
                {personnelsLength > 1 ? "personnels" : "personnel"}
              </Badge>
            </div>
          </form>
        </div>
      }
    />
  );
};
