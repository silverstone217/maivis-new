import AddForm from "@/components/admin/personnels/AddForm";
import React from "react";

function AddPersonnelPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* Top header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Ajouter un personnel</h1>
        <p className="text-sm text-gray-500 max-w-lg text-balance">
          Ajouter un personnel à votre entreprise, vous pouvez ajouter les
          informations de son compte, son poste, son adresse, etc.
        </p>
      </div>

      {/* Form */}
      <AddForm />
    </div>
  );
}

export default AddPersonnelPage;
