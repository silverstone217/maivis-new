"use client";
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
    <div className="rounded-md border p-2 w-full">
      {/* filter top */}
      <div className="flex flex-col md:flex-row gap-4 py-4 w-full md:flex-wrap">
        <Input
          placeholder="Filtrer par nom du client..."
          value={
            (table.getColumn("clientName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("clientName")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-[300px] xl:max-w-[200px]"
        />

        {/* select job */}
        <Select
          onValueChange={(value) => {
            // if value is "all", then clear the filter
            if (value === "all") {
              table.getColumn("service")?.setFilterValue(undefined);
            } else {
              table.getColumn("service")?.setFilterValue(value);
            }
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrer par service..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="capitalize">
              Tous les services
            </SelectItem>
            {uniqueService.map((service) => (
              <SelectItem key={service} value={service!} className="capitalize">
                {returnDataValue(service!, JOBS_LIST)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* select status */}
        <Select
          onValueChange={(value) => {
            if (value === "all") {
              table.getColumn("status")?.setFilterValue(undefined);
            } else {
              table.getColumn("status")?.setFilterValue(value);
            }
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrer par status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="capitalize">
              Tous les status
            </SelectItem>
            {uniqueStatus.map((status) => (
              <SelectItem key={status} value={status!} className="capitalize">
                {returnDataValue(status!, STATUS_LIST)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* select is paid */}
        <Select
          onValueChange={(value) => {
            table.getColumn("isPaid")?.setFilterValue(value);
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrer par paiement..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="capitalize">
              Tous les paiements
            </SelectItem>
            {uniqueIsPaid.map((isPaid) => (
              <SelectItem
                key={isPaid.toString()}
                value={isPaid.toString()}
                className="capitalize"
              >
                {isPaid ? "Oui" : "Non"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* colonnes */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="md:ml-auto">
              Colonnes <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* table colonne */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Pas resultats.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} sur{" "}
            {table.getFilteredRowModel().rows.length} ligne(s) selectionnée(s).
          </div> */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Precedent
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
