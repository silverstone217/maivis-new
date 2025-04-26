import { getPersonnelByIDAction } from "@/actions/personnel-actions";
import React from "react";
import { PersonnelsTypes } from "@/types/personnelTypes";
import { redirect } from "next/navigation";
import ModifyForm from "@/components/admin/personnels/ModifyForm";
type PersonnelPageProps = {
  params: Promise<{ id: string }>;
};

async function PersonnelPage({ params }: PersonnelPageProps) {
  const { id } = await params;

  if (!id) {
    redirect("/personnels");
  }

  const { data, error, message } = await getPersonnelByIDAction(id);

  if (error) {
    return <div>{message}</div>;
  }

  if (!data) {
    return <div>Personnel non trouvé</div>;
  }

  const personnel = data as PersonnelsTypes;

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Informations du personnel</h1>
        <p className="text-sm text-gray-500 max-w-lg text-balance">
          Voir les informations du personnel, Modifier les informations du
          personnel; Supprimer le personnel et plus encore.
        </p>
      </div>

      {/* Personnel Info + Form */}
      <ModifyForm personnel={personnel} />
    </div>
  );
}

export default PersonnelPage;
