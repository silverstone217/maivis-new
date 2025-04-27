"use client";
import React, { useMemo, useState } from "react";
import { PersonnelsTypes } from "@/types/personnelTypes";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SelectComponent from "@/components/SelectComponent";
import { isEmptyString } from "@/utils/functions";
import { JOBS_LIST } from "@/utils/otherData";
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
import { X } from "lucide-react";
type ModifyFormProps = {
  personnel: PersonnelsTypes;
};

const ModifyForm = ({ personnel }: ModifyFormProps) => {
  const [job, setJob] = useState(personnel.job || "");
  const [avenue, setAvenue] = useState(personnel.avenue || "");
  const [commune, setCommune] = useState(personnel.commune || "");
  const [ville, setVille] = useState(personnel.ville || "");
  const [province, setProvince] = useState(personnel.province || "Kinshasa");
  //   const [codePostal, setCodePostal] = useState("");
  //   const [pays, setPays] = useState("");
  const [telephone, setTelephone] = useState(personnel.telephone || "");
  const [email, setEmail] = useState(personnel.email || "");
  //   const [password, setPassword] = useState("");
  const [name, setName] = useState(personnel.name || "");
  const [gender, setGender] = useState(personnel.gender || "");
  const [birthday, setBirthday] = useState(
    personnel.birthday
      ? new Date(personnel.birthday).toISOString().split("T")[0]
      : ""
  );

  //   image
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(personnel.image || "");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

      if (response.error) {
        toast.error(response.message);
      }

      if (response.data) {
        toast.success(response.message);
        router.push(`/gestion-personnels/${personnel.id}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Une erreur est survenue lors de la modification du personnel"
      );
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    }
  };

  //   Ban or unban personnel
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
      console.log(error);
      toast.error("Une erreur est survenue lors de la bannissement");
    } finally {
      setTimeout(() => setIsLoading(false), 2500);
    }
  };

  //   Delete personnel
  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const confirm = await window.confirm(
        "Voulez-vous vraiment supprimer ce personnel ?\n\nCette action est irréversible."
      );

      if (!confirm) return;

      const response = await deletePersonnelAction(id);
      if (response.error) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      router.push(`/personnels`);
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la suppression");
    } finally {
      setTimeout(() => setIsLoading(false), 2500);
    }
  };

  //   upload image to firebase
  const uploadImage = async (file: File) => {
    setIsLoading(true);
    try {
      if (!file) return;

      //   image size less than 2mb
      if (file.size > 2 * 1024 * 1024) {
        toast.error("La taille de l'image est trop grande, max 2mb");
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
      router.push(`/personnels/${personnel.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la mise à jour de l'image");
    } finally {
      setTimeout(() => setIsLoading(false), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-4">
      {/* image */}
      <div className="flex flex-col gap-4 w-full">
        {/* image exist or upload image */}
        <div>
          {imagePreview ? (
            <div className="relative w-fit flex items-center gap-2">
              <Image
                src={imagePreview}
                alt="image"
                width={100}
                height={100}
                className="size-20 rounded-full object-cover"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setImagePreview("")}
                className=""
                disabled={isLoading}
              >
                <X className="size-5 text-red-500" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label htmlFor="image">Image</Label>
              <Input
                type="file"
                id="image"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
              {personnel.image && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setImagePreview(personnel.image ?? "");
                    setImage(null);
                  }}
                  disabled={isLoading}
                >
                  Annuler l&apos;ajout
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {image && (
            <Image
              src={URL.createObjectURL(image)}
              alt="image"
              width={100}
              height={100}
              className="size-20 rounded-full object-cover"
            />
          )}
          {/* upload image */}
          {image && (
            <Button
              type="button"
              variant="outline"
              onClick={() => uploadImage(image)}
              disabled={isLoading || !image}
            >
              {isLoading && image ? "Uploading..." : "Upload"}
            </Button>
          )}
        </div>
      </div>

      {/* Other informations */}
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Prenom et Nom</Label>
          <Input
            type="text"
            id="name"
            placeholder="ex: John Doe"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
            className="w-full"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            minLength={3}
            maxLength={60}
          />
        </div>
        {/* Email */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="ex: john.doe@example.com"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="w-full"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            minLength={3}
            maxLength={60}
          />
        </div>
        {/* Gender */} {/* Gender */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="gender">Genre</Label>
          <SelectComponent
            options={[
              { label: "Masculin", value: "male" },
              { label: "Féminin", value: "female" },
            ]}
            placeholder="Choisir un genre"
            defaultValue={gender}
            onChange={setGender}
            isRequired
            isDisabled={isLoading}
          />
        </div>
        {/* Birthday */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="birthday">Date de naissance</Label>
          <Input
            type="date"
            id="birthday"
            defaultValue={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            disabled={isLoading}
            required
            className="w-full"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
        {/* Job */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="job">Poste</Label>
          <SelectComponent
            options={JOBS_LIST}
            placeholder="Choisir un poste"
            defaultValue={job}
            onChange={setJob}
            isRequired
            isDisabled={isLoading}
          />
        </div>
        {/* Avenue */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="avenue">Numero et Avenue</Label>
          <Input
            type="text"
            id="avenue"
            placeholder="ex: 123 Rue de la Paix"
            defaultValue={avenue}
            onChange={(e) => setAvenue(e.target.value)}
            disabled={isLoading}
            required
            className="w-full"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            minLength={3}
            maxLength={60}
          />
        </div>
        {/* Commune */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="commune">Commune</Label>
          <Input
            type="text"
            id="commune"
            placeholder="ex: bandalugnwa"
            minLength={3}
            maxLength={60}
            defaultValue={commune}
            onChange={(e) => setCommune(e.target.value)}
            disabled={isLoading}
            required
            className="w-full"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
        {/* Ville */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="ville">Ville</Label>
          <Input
            type="text"
            id="ville"
            placeholder="ex: Kinshasa"
            defaultValue={ville}
            onChange={(e) => setVille(e.target.value)}
            disabled={isLoading}
            required
            className="w-full"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            minLength={3}
            maxLength={60}
          />
        </div>
        {/* Province */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="province">Province</Label>
          <Input
            type="text"
            id="province"
            placeholder="ex: Kinshasa"
            defaultValue={province}
            onChange={(e) => setProvince(e.target.value)}
            disabled={isLoading}
            required
            className="w-full"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
        {/* Telephone */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="telephone">Telephone</Label>
          <div className="relative w-full">
            <span className="text-sm font-medium absolute left-2 top-1/2 -translate-y-1/2 border-r border-gray-300 pr-2">
              +243
            </span>
            <Input
              type="tel"
              id="telephone"
              value={telephone}
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
        {/* Submit */}
        <Button
          type="submit"
          disabled={isDisabledBtn}
          className="cursor-pointer"
        >
          {isLoading && !image ? "Enregistrement..." : "Enregistrer"}
        </Button>
        {/* Danger Zone */}
        <div
          className="flex flex-col gap-4 mt-4 border-2 bg-destructive text-destructive-foreground
         p-4 border-destructive"
        >
          <div>
            <h2 className="text-lg font-bold">Danger Zone</h2>
            <p className="text-sm text-destructive-foreground/80 max-w-lg text-balance">
              {` Bannir un personnel signifie qu'il ne pourra plus accéder à son
              compte.`}

              {`   Et supprimer un personnel signifie qu'il sera supprimé de la base
              de données et ne pourra plus accéder à son compte à tout jamais.`}
            </p>
          </div>

          {!personnel.isBanned ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => handleBanOrUnban(personnel.id, true)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:opacity-40 cursor-pointer"
            >
              Bannir
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span>Status</span> <span>Utilisateur est banni</span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleBanOrUnban(personnel.id, false)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:opacity-40 cursor-pointer"
                disabled={isLoading}
              >
                Débannir
              </Button>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => handleDelete(personnel.id)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:opacity-40 cursor-pointer"
            disabled={isLoading}
          >
            Supprimer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ModifyForm;
