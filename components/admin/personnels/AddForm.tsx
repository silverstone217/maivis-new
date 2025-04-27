"use client";
import {
  AddPersonnelType,
  addPersonnelAction,
} from "@/actions/personnel-actions";
import SelectComponent from "@/components/SelectComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isEmptyString } from "@/utils/functions";
import { JOBS_LIST } from "@/utils/otherData";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

function AddForm() {
  const [job, setJob] = useState("");
  const [avenue, setAvenue] = useState("");
  const [commune, setCommune] = useState("");
  const [ville, setVille] = useState("");
  const [province, setProvince] = useState("Kinshasa");
  //   const [codePostal, setCodePostal] = useState("");
  //   const [pays, setPays] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");

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
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData: AddPersonnelType = {
        name: name.trim().toLowerCase(),
        job: job.trim().toLowerCase(),
        avenue: avenue.trim().toLowerCase(),
        commune: commune.trim().toLowerCase(),
        ville: ville.trim().toLowerCase(),
        province: province.trim().toLowerCase(),
        telephone: telephone.trim(),
        email: email.trim().toLowerCase(),
        gender,
        birthday: new Date(birthday),
      };

      const response = await addPersonnelAction(formData);

      if (response.error) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);

      setTimeout(() => router.push("/gestion-personnels"), 2000);
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setTimeout(() => setIsLoading(false), 2500);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-4">
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Prenom et Nom</Label>
          <Input
            type="text"
            id="name"
            placeholder="ex: John Doe"
            value={name}
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
            value={email}
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
            value={birthday}
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
            value={avenue}
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
            value={commune}
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
            value={ville}
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
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </div>
  );
}

export default AddForm;
