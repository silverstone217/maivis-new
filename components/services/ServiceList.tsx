"use client";

import { formatPrice, returnDataValue } from "@/utils/functions";
import { DURATION_LIST, JOBS_LIST, SERVICES_LIST } from "@/utils/otherData";
import Image from "next/image";
import Link from "next/link";
import { Clock, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";

export const ServiceList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SERVICES_LIST.map((service) => (
        <Link
          href={`/services/${service.service}`}
          key={service.service}
          className="group"
          aria-label={`Voir le service ${returnDataValue(
            service.service,
            JOBS_LIST
          )}`}
        >
          <Card
            className="flex flex-col pt-0 h-full shadow-lg transition-transform duration-300 
          ease-in-out hover:scale-[1.03] gap-3 lg:gap-6"
          >
            <CardHeader className="p-0 overflow-hidden rounded-t-lg relative h-52">
              <Image
                src={service.image}
                alt={service.service}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                priority
              />
            </CardHeader>

            <CardContent className="flex flex-col flex-1 p-4">
              <CardTitle className="text-lg font-semibold capitalize mb-2 text-gray-900 dark:text-gray-100">
                {returnDataValue(service.service, JOBS_LIST)}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-grow">
                {service.description}
              </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300"
              >
                <Clock size={16} />
                <span className="capitalize text-xs">
                  {returnDataValue(service.duration, DURATION_LIST)}
                </span>
              </Badge>

              <Badge
                variant="secondary"
                className="flex items-center gap-1 font-semibold"
              >
                <DollarSign size={16} />
                <span>{formatPrice(service.price)}</span>
              </Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};
