import React from "react";
import { getClientsAction } from "@/actions/clients-action";
import {
  ClientsDataTable,
  ClientsColumns,
} from "@/components/admin/clients/DisplayTableList";
import { User } from "@prisma/client";
async function ClientPage() {
  const { data, error, message } = await getClientsAction();

  if (error) {
    return <div>{message}</div>;
  }

  const clients = data as User[];
  return (
    <main>
      <div className="container mx-auto">
        {/* Title and description */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Les clients</h1>
          <p className="text-gray-500 text-sm max-w-lg text-balance">
            La liste des clients de votre entreprise.
          </p>
        </div>

        {/* Separator */}
        <div className="container mx-auto py-5"></div>

        {/* List of clients */}
        <ClientsDataTable data={clients} columns={ClientsColumns} />
      </div>
    </main>
  );
}

export default ClientPage;
