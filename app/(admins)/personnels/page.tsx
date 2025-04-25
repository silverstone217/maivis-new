import { getUser } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import React from "react";
import { getPersonnelsAction } from "@/actions/personnel-actions";
import {
  PersonnelsDataTable,
  UsersColumns,
} from "@/components/admin/personnels/DisplayTableData";
async function PersonnelsPage() {
  const user = await getUser();
  const { data: personnels, error, message } = await getPersonnelsAction();

  return (
    <div className="flex flex-col gap-4">
      {/* Top header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* TEXTS */}
        <div className="">
          <h1 className="text-2xl font-bold">Personnels</h1>
          <p className="text-sm text-gray-500 max-w-lg text-balance">
            Gérer les personnels de votre entreprise, ajouter, modifier,
            supprimer et plus encore.
          </p>
        </div>

        {/* Btn */}
        <div className="w-full lg:w-fit">
          <Link href={"/personnels/ajouter"}>
            <Button className="gap-2 w-full lg:w-fit">
              <PlusIcon className="size-4" />
              <span>Ajouter un personnel</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <PersonnelsDataTable data={personnels} columns={UsersColumns} />
    </div>
  );
}

export default PersonnelsPage;
