import TableData from "@/components/admin/services/TableData";
import { getPersonnelsAction } from "@/actions/personnel-actions";
async function ServicesManagementPage() {
  const personnels = (await getPersonnelsAction()).data;
  return (
    <main>
      <div
        className="container mx-auto flex lg:flex-row flex-col gap-4 lg:items-center
       lg:justify-between transition-all duration-500 ease-in-out"
      >
        <div className="ease-in-out transition-all duration-500">
          <h1 className="text-2xl font-bold">Gestion des services</h1>
          <p className="text-gray-500 text-sm max-w-lg text-balance">
            La liste des services disponibles pour les clients de votre
            entreprise.
          </p>
        </div>
        {/* Nouveaux services */}
        {/* <AddServiceDialogForm /> */}
      </div>

      {/* separator space */}
      <div className="container mx-auto py-5"></div>

      <div className="container mx-auto">
        {/* Liste des services */}
        <TableData personnels={personnels} />
      </div>
    </main>
  );
}

export default ServicesManagementPage;
