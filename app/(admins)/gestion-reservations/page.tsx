import { getAllBookingsForAdmin } from "@/actions/booking-action";
import {
  BookingsDataTable,
  BookingsColumns,
} from "@/components/admin/bookings/DisplayTableList";
import { bookingsWithPersonnelAdminType } from "@/types/bookings";

async function GestionReservationsPage() {
  const { data, error, message } = await getAllBookingsForAdmin();
  if (error) {
    return <div className="text-red-500">{message}</div>;
  }
  if (!data) {
    return <div className="text-red-500">{message}</div>;
  }

  const bookings = data as bookingsWithPersonnelAdminType[];

  return (
    <div className="flex flex-col gap-4">
      {/* Top header */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Gestion des réservations</h1>
        <p className="text-sm text-gray-500 max-w-lg text-balance">
          Gérer les réservations de votre entreprise, modifier, supprimer et
          plus encore.
        </p>
      </div>

      {/* Table */}
      <BookingsDataTable<bookingsWithPersonnelAdminType, unknown>
        columns={BookingsColumns}
        data={data as bookingsWithPersonnelAdminType[]}
      />
    </div>
  );
}

export default GestionReservationsPage;
