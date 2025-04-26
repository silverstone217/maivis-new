import React from "react";
import { getAdminsAction } from "@/actions/admins-actions";
import { getUser } from "@/actions/auth-actions";
import { NotPermitted } from "@/components/NotAuthorized";
import {
  AdminsColumns,
  AdminsDataTable,
} from "@/components/admin/admins/DisplayTableList";
import { User } from "@prisma/client";
async function AdminsPage() {
  const user = await getUser();
  const { data, error, message } = await getAdminsAction();

  if (!user) return null;

  const isPermission = user.role
    ? ["SUPER_ADMIN", "ADMIN"].includes(user.role)
    : false;

  if (!isPermission) {
    return <NotPermitted />;
  }

  if (error) {
    return <div>{message}</div>;
  }

  const admins = data as User[];

  return (
    <main>
      <div className="container mx-auto">
        {/* Title and description */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Les administrateurs</h1>
          <p className="text-gray-500 text-sm max-w-lg text-balance">
            La liste des administrateurs et Modérateurs de votre entreprise.
          </p>
        </div>

        {/* Separator */}
        <div className="container mx-auto py-5"></div>

        {/* List of admins */}
        <AdminsDataTable data={admins} columns={AdminsColumns} />
      </div>
    </main>
  );
}

export default AdminsPage;
