"use client";
import React, { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../../ui/button";
import { PlusIcon } from "lucide-react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import SelectComponent from "../../SelectComponent";
import { JOBS_LIST } from "@/utils/otherData";
import { Textarea } from "../../ui/textarea";
import { isEmptyString } from "@/utils/functions";
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { toast } from "sonner";
import { addServiceAction, AddServiceType } from "@/actions/service-actions";
import { useRouter } from "next/navigation";

const AddServiceDialogForm = () => {
  const [service, setService] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Check if the button is disabled
  const isDisabledButton = useMemo(() => {
    if (isLoading) return true;
    if (
      isEmptyString(service) ||
      isEmptyString(description) ||
      price <= 0 ||
      isNaN(price) ||
      !image
    )
      return true;
  }, [service, description, price, image, isLoading]);

  // Handle submit
  const handleSubmit = async () => {
    // e.preventDefault();
    setIsLoading(true);
    if (!image) {
      toast.error("Veuillez ajouter une image");
      return;
    }
    const imageUrl = await sendImageToFirebase(image);

    try {
      if (isEmptyString(imageUrl)) {
        toast.error("Une erreur est survenue lors de l'ajout du service");
        return;
      }

      const formData: AddServiceType = {
        service,
        description: description.toLowerCase().trim(),
        price,
        image: imageUrl,
      };

      const response = await addServiceAction(formData);

      if (response.error) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      setService("");
      setDescription("");
      setPrice(0);
      setImage(null);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de l'ajout du service");
      if (imageUrl) {
        await deleteObject(ref(storage, imageUrl));
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  //   send imag to firebase and get the url
  const sendImageToFirebase = async (image: File) => {
    let url = "";
    try {
      const storageRef = ref(storage, `maivis/services/${image.name}`);
      const snapshot = await uploadBytesResumable(storageRef, image);
      url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2" disabled={isLoading}>
          <PlusIcon className="w-4 h-4" />
          <span>Nouveau service</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Ajouter un service</AlertDialogTitle>
          <AlertDialogDescription>
            Ajoutez un service pour votre entreprise. Toutes les informations
            sont obligatoires.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Form */}
        <form className="flex flex-col gap-4 w-full">
          {/* Service */}
          <div className="flex flex-col gap-2">
            <Label>Service</Label>
            <SelectComponent
              options={JOBS_LIST}
              defaultValue={service}
              onChange={setService}
              placeholder="Choisir un service"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 w-full">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du service"
              className="w-full max-h-[200px] min-h-[100px]"
              //   rows={12}
              required
              maxLength={400}
              minLength={10}
            />
          </div>

          {/* Prix USD */}
          <div className="flex flex-col gap-2">
            <Label>Prix USD</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Prix du service"
              className="w-full"
              required
              min={0}
              max={10000}
            />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-2">
            <Label>Image</Label>
            <Input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              placeholder="Image du service"
              className="w-full"
              accept="image/*"
              max={2 * 1024 * 1024}
            />
            <p className="text-sm text-gray-500">Taille maximale: 2MB</p>
          </div>
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel type="button">Annuler</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            disabled={isDisabledButton}
            onClick={handleSubmit}
          >
            {isLoading ? "En cours..." : "Ajouter"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddServiceDialogForm;
