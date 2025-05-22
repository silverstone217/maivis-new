"use client";
import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice, returnDataValue } from "@/utils/functions";
import { JOBS_LIST, STATUS_LIST } from "@/utils/otherData";
import { bookingsWithPersonnelAdminType } from "@/types/bookings";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// delete component
const ActionsCell = ({
  booking,
}: {
  booking: bookingsWithPersonnelAdminType;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(booking.id)}
        >
          Copier l&apos;ID réservation
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/gestion-reservations/${booking.id}`}>
            <span className="text-sm">Consulter</span>
          </Link>
          {/* <ModifyRoleUser admin={admins} /> */}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled
          className="text-red-500 hover:text-red-600 hover:cursor-pointer"
        >
          Annuler
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const BookingsColumns: ColumnDef<bookingsWithPersonnelAdminType>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {(row.index + 1).toString().padStart(2, "0")}
      </div>
    ),
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom du client
          <ArrowUpDown className="ml-2 h-4 w-4 capitalize" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-sm">{row.getValue("clientName")}</div>
    ),
  },
  {
    accessorKey: "clientNumber",
    header: "Téléphone",
    cell: ({ row }) => (
      <div className="capitalize text-sm">{row.getValue("clientNumber")}</div>
    ),
  },
  {
    accessorKey: "service",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Service
          <ArrowUpDown className="ml-2 h-4 w-4 " />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        <span
          className={`px-2.5 py-0.5 rounded-xl bg-gradient-to-r
            text-sm font-medium
          line-clamp-1 text-left
          `}
        >
          {returnDataValue(row.getValue("service")!, JOBS_LIST)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize text-sm">
        {returnDataValue(row.getValue("status")!, STATUS_LIST)}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Prix",
    cell: ({ row }) => {
      const price = row.getValue("price");

      return <div className="text-sm">{formatPrice(price as number)}</div>;
    },
  },
  {
    accessorKey: "isPaid",
    header: "A payé",
    cell: ({ row }) => (
      <div className="capitalize text-sm">
        {row.getValue("isPaid") ? "Oui" : "Non"}
      </div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: "A reservé le",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));

      // Format the createdAt as a dollar createdAt
      const formatted = createdAt.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return <div className="text-sm">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const booking = row.original;
      return <ActionsCell booking={booking} />;
    },
  },
];

export function BookingsDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 12,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const bookings = data as bookingsWithPersonnelAdminType[];

  const uniqueService = Array.from(new Set(bookings.map((dt) => dt.service)));
  const uniqueStatus = Array.from(new Set(bookings.map((dt) => dt.status)));
  const uniqueIsPaid = Array.from(new Set(bookings.map((dt) => dt.isPaid)));

  return (
    <div className="w-full rounded-2xl shadow-lg border bg-white dark:bg-gray-900 p-0 md:p-4 overflow-x-auto">
      {/* Filtres */}
      <div
        className="flex flex-col md:flex-row md:flex-wrap gap-3 p-4 border-b 
      border-gray-100 dark:border-gray-800 overflow-x-auto"
      >
        <Input
          placeholder="Filtrer par client..."
          value={
            (table.getColumn("clientName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("clientName")?.setFilterValue(event.target.value)
          }
          className="w-full md:w-60"
        />
        <Select
          onValueChange={(value) => {
            table
              .getColumn("service")
              ?.setFilterValue(value === "all" ? undefined : value);
          }}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Service..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les services</SelectItem>
            {uniqueService.map((service) => (
              <SelectItem key={service} value={service!} className="capitalize">
                {returnDataValue(service!, JOBS_LIST)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            table
              .getColumn("status")
              ?.setFilterValue(value === "all" ? undefined : value);
          }}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Statut..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {uniqueStatus.map((status) => (
              <SelectItem key={status} value={status!} className="capitalize">
                {returnDataValue(status!, STATUS_LIST)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => {
            table
              .getColumn("isPaid")
              ?.setFilterValue(value === "all" ? undefined : value);
          }}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Paiement..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les paiements</SelectItem>
            {uniqueIsPaid.map((isPaid) => (
              <SelectItem key={isPaid?.toString()} value={isPaid?.toString()}>
                {isPaid ? "Oui" : "Non"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              Colonnes <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-gray-50 dark:bg-gray-800"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-b-2xl">
        <span className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} sur{" "}
          {table.getPageCount()}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
