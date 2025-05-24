"use client";
import React, { useMemo, useState } from "react";
import { PersonnelsTypes } from "@/types/personnelTypes";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { JOBS_LIST } from "@/utils/otherData";
import SelectComponent from "@/components/SelectComponent";
import { isEmptyString } from "@/utils/functions";
import {
  banOrUnbanPersonnelAction,
  deletePersonnelAction,
  updatePersonnelAction,
  uploadImageAction,
} from "@/actions/personnel-actions";
import { toast } from "sonner";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";
import {
  X,
  Camera,
  Loader2,
  Ban,
  Trash2,
  User2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BadgeCheck,
  Pencil,
} from "lucide-react";

type ModifyFormProps = {
  personnel: PersonnelsTypes;
};

const GENDER_OPTIONS = [
  { label: "Masculin", value: "male" },
  { label: "Féminin", value: "female" },
];

const ModifyForm = ({ personnel }: ModifyFormProps) => {
  const [job, setJob] = useState(personnel.job || "");
  const [avenue, setAvenue] = useState(personnel.avenue || "");
  const [commune, setCommune] = useState(personnel.commune || "");
  const [ville, setVille] = useState(personnel.ville || "");
  const [province, setProvince] = useState(personnel.province || "Kinshasa");
  const [telephone, setTelephone] = useState(personnel.telephone || "");
  const [email, setEmail] = useState(personnel.email || "");
  const [name, setName] = useState(personnel.name || "");
  const [gender, setGender] = useState(personnel.gender || "");
  const [birthday, setBirthday] = useState(
    personnel.birthday
      ? new Date(personnel.birthday).toISOString().split("T")[0]
      : ""
  );
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(personnel.image || "");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const isDisabledBtn = useMemo(() => {
    if (isLoading) return true;
    if (isEmptyString(name)) return true;
    if (isEmptyString(job)) return true;
    if (isEmptyString(avenue)) return true;
    if (isEmptyString(commune)) return true;
    if (isEmptyString(ville)) return true;
    if (isEmptyString(province)) return true;
    if (isEmptyString(telephone)) return true;
    if (isEmptyString(email)) return true;
    if (isEmptyString(gender)) return true;
    if (isEmptyString(birthday)) return true;

    if (
      name === personnel.name &&
      job === personnel.job &&
      avenue === personnel.avenue &&
      commune === personnel.commune &&
      ville === personnel.ville &&
      province === personnel.province &&
      telephone === personnel.telephone &&
      email === personnel.email &&
      gender === personnel.gender &&
      new Date(birthday).toISOString().split("T")[0] ===
        personnel.birthday?.toISOString().split("T")[0]
    )
      return true;
    return false;
  }, [
    isLoading,
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
    personnel,
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updatePersonnelAction(personnel.id, {
        name,
        job,
        avenue,
        commune,
        ville,
        province,
        telephone,
        email,
        gender,
        birthday: new Date(birthday),
      });

      if (response.error) toast.error(response.message);
      if (response.data) {
        toast.success(response.message);
        router.push(`/gestion-personnels/${personnel.id}`);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la modification.");
    } finally {
      setTimeout(() => setIsLoading(false), 1200);
    }
  };

  const handleBanOrUnban = async (id: string, isBanned: boolean) => {
    setIsLoading(true);
    try {
      const response = await banOrUnbanPersonnelAction(id, isBanned);
      if (response.error) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      router.push(`/gestion-personnels/${id}`);
    } catch (error) {
      toast.error("Erreur lors du bannissement.");
    } finally {
      setTimeout(() => setIsLoading(false), 1200);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const confirm = window.confirm(
        "Voulez-vous vraiment supprimer ce personnel ?\n\nCette action est irréversible."
      );
      if (!confirm) return;

      const response = await deletePersonnelAction(id);
      if (response.error) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      router.push(`/gestion-personnels`);
    } catch (error) {
      toast.error("Erreur lors de la suppression.");
    } finally {
      setTimeout(() => setIsLoading(false), 1200);
    }
  };

  // Upload image
  const uploadImage = async (file: File) => {
    setIsLoading(true);
    try {
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image trop grande, max 2mb");
        return;
      }
      const storageRef = ref(storage, `maivis/personnels/${personnel.id}`);
      const snapshot = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setImagePreview(url);
      const response = await uploadImageAction(personnel.id, url);
      if (response.error) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      setImage(null);
      router.push(`/gestion-personnels/${personnel.id}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'image");
    } finally {
      setTimeout(() => setIsLoading(false), 1200);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-[80svh] px-2 py-6 bg-background">
      <Card className="w-full max-w-xl shadow-lg border-none bg-card">
        <CardHeader className="flex flex-col items-center gap-4 pb-2">
          <div className="relative">
            <Avatar className="w-24 h-24 ring-2 ring-primary ring-offset-2">
              <AvatarImage
                src={imagePreview || "/avatar.svg"}
                alt={name}
                className="object-cover"
              />
              <AvatarFallback>
                <User2 className="w-10 h-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="image"
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-primary/90 transition"
              title="Changer la photo"
            >
              <Camera className="w-5 h-5" />
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                disabled={isLoading}
              />
            </label>
          </div>
          {image && (
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => uploadImage(image)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <Pencil className="w-4 h-4" />
                )}
                <span className="ml-2">Mettre à jour</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setImage(null);
                  setImagePreview(personnel.image || "");
                }}
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <CardTitle className="text-2xl font-semibold text-center">
            Modifier le personnel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="ex: John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  minLength={3}
                  maxLength={60}
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ex: john.doe@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  minLength={3}
                  maxLength={60}
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <Label htmlFor="gender">Genre</Label>
                <SelectComponent
                  options={GENDER_OPTIONS}
                  placeholder="Genre"
                  defaultValue={gender}
                  onChange={setGender}
                  isRequired
                  isDisabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="birthday">Date de naissance</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Label htmlFor="job">Poste</Label>
                <SelectComponent
                  options={JOBS_LIST}
                  placeholder="Poste"
                  defaultValue={job}
                  onChange={setJob}
                  isRequired
                  isDisabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    +243
                  </span>
                  <Input
                    id="telephone"
                    type="tel"
                    placeholder="970000000"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    disabled={isLoading}
                    className="pl-12"
                    minLength={9}
                    maxLength={9}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="avenue">Avenue</Label>
                <Input
                  id="avenue"
                  type="text"
                  placeholder="ex: 123 Rue de la Paix"
                  value={avenue}
                  onChange={(e) => setAvenue(e.target.value)}
                  disabled={isLoading}
                  minLength={3}
                  maxLength={60}
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <Label htmlFor="commune">Commune</Label>
                <Input
                  id="commune"
                  type="text"
                  placeholder="ex: Bandalungwa"
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  disabled={isLoading}
                  minLength={3}
                  maxLength={60}
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  type="text"
                  placeholder="ex: Kinshasa"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  disabled={isLoading}
                  minLength={3}
                  maxLength={60}
                  required
                  autoComplete="off"
                />
              </div>
              <div>
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  type="text"
                  placeholder="ex: Kinshasa"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  disabled={isLoading}
                  minLength={3}
                  maxLength={60}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isDisabledBtn}
              className="w-full mt-2"
              size="lg"
            >
              {isLoading && !image ? (
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
              ) : (
                <BadgeCheck className="mr-2 w-4 h-4" />
              )}
              Enregistrer les modifications
            </Button>
          </form>
          {/* Danger Zone */}
          <div className="rounded-xl border bg-destructive/5 p-4 mt-4 flex flex-col gap-3">
            <div>
              <h3 className="font-semibold text-destructive mb-1">
                Zone dangereuse
              </h3>
              <p className="text-sm text-foreground/80">
                Bannir un personnel le bloque temporairement. Supprimer un
                personnel est définitif.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              {!personnel.isBanned ? (
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleBanOrUnban(personnel.id, true)}
                  disabled={isLoading}
                >
                  <Ban className="mr-2 w-4 h-4" />
                  Bannir
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-destructive text-destructive"
                  onClick={() => handleBanOrUnban(personnel.id, false)}
                  disabled={isLoading}
                >
                  <BadgeCheck className="mr-2 w-4 h-4" />
                  Débannir
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-destructive text-destructive"
                onClick={() => handleDelete(personnel.id)}
                disabled={isLoading}
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ModifyForm;
