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
import Image from "next/image";
import { returnDataValue } from "@/utils/functions";
import { ROLES_LIST } from "@/utils/otherData";
import noImage from "@/public/images/no-user.png";
import Link from "next/link";
import { User } from "@prisma/client";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const ActionsCell = ({ client }: { client: User }) => {
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
          onClick={() => navigator.clipboard.writeText(client.id)}
        >
          Copier l&apos;ID client
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/gestion-reservations/${client.id}`}>
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

export const ClientsColumns: ColumnDef<User>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <div>
        <Image
          src={row.getValue("image") ?? noImage}
          alt="image du client"
          width={800}
          height={800}
          priority
          className="object-cover brightness-90 w-12 h-12 rounded-full border"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0"
      >
        Nom
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize text-sm">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0"
      >
        Rôle
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        <span className="px-2.5 py-0.5 rounded-xl bg-gradient-to-r from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-700 text-sm font-medium">
          {returnDataValue(row.getValue("role")!, ROLES_LIST)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "A rejoint le",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
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
      const client = row.original;
      return <ActionsCell client={client} />;
    },
  },
];

export function ClientsDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
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

  // Pour le filtre rôle
  const uniqueRole = Array.from(new Set((data as User[]).map((dt) => dt.role)));

  return (
    <div className="w-full rounded-2xl shadow-lg border bg-white dark:bg-gray-900 p-0 md:p-4 overflow-x-auto">
      {/* Filtres */}
      <div className="flex flex-col md:flex-row md:flex-wrap gap-3 p-4 border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
        <Input
          placeholder="Filtrer par nom..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-full md:w-60"
        />
        <Select
          onValueChange={(value) => {
            table
              .getColumn("role")
              ?.setFilterValue(value === "all" ? undefined : value);
          }}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrer par rôle..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            {uniqueRole.map((role) => (
              <SelectItem key={role} value={role!}>
                {returnDataValue(role!, ROLES_LIST)}
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
          <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900">
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
