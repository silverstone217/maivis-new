"use client";
import React from "react";
import { DURATION_LIST, JOBS_LIST, SERVICES_LIST } from "@/utils/otherData";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice, returnDataValue } from "@/utils/functions";
import { PersonnelsTypes } from "@/types/personnelTypes";

type TableDataProps = {
  personnels: PersonnelsTypes[];
};

const TableData = ({ personnels }: TableDataProps) => {
  return (
    <Table>
      <TableCaption>Liste des services</TableCaption>
      <TableHeader className="bg-gray-100 dark:bg-gray-800">
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Prix</TableHead>
          <TableHead>Durée</TableHead>
          <TableHead className="text-center">Personnels</TableHead>
          {/* <TableHead>Action</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {SERVICES_LIST.map((service) => (
          <TableRow
            key={service.name}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 capitalize"
          >
            <TableCell>
              <Image
                src={service.image}
                alt={service.name}
                width={200}
                height={200}
                className="rounded-xl object-cover size-16"
                priority
              />
            </TableCell>
            <TableCell className="font-medium">
              {returnDataValue(service.service, JOBS_LIST)}
            </TableCell>

            <TableCell className="font-medium">
              {formatPrice(service.price)}
            </TableCell>
            <TableCell>
              {returnDataValue(service.duration, DURATION_LIST)}
            </TableCell>
            <TableCell className="font-medium text-center">
              {personnels
                .filter((personnel) => personnel.job === service.service)
                .length.toString()
                .padStart(2, "0") ?? "00"}
            </TableCell>
            {/* <TableCell>
              <Button variant="outline">Modifier</Button>
              <Button variant="destructive">Supprimer</Button>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableData;
