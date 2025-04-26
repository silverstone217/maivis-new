"use client";

import { formatPrice, returnDataValue } from "@/utils/functions";
import { DURATION_LIST, JOBS_LIST, SERVICES_LIST } from "@/utils/otherData";
import Image from "next/image";
import Link from "next/link";

export const ServiceList = () => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
    transition-all duration-500 ease-in-out
    "
    >
      {SERVICES_LIST.map((service) => (
        <Link href={`/services/${service.service}`} key={service.service}>
          <div
            className="grid grid-cols-3 border shadow-lg w-full flex-row transition-all 
          duration-500 ease-in-out group rounded-lg"
          >
            {/* image */}
            <div className="overflow-hidden h-40 flex-shrink-0 col-span-1 rounded-l-lg">
              <Image
                src={service.image}
                alt={service.service}
                width={600}
                height={600}
                className="object-cover h-full w-full transition-all duration-500 ease-in-out
                group-hover:scale-125 rounded-l-lg
                "
                priority
              />
            </div>
            {/* title */}
            <div className="flex flex-col gap-2 py-2 px-4 col-span-2">
              <h3 className="text-lg font-bold capitalize">
                {returnDataValue(service.service, JOBS_LIST)}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-3 h-16 overflow-hidden">
                {service.description}
              </p>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-xs text-gray-500 capitalize">
                  Travail/{returnDataValue(service.duration, DURATION_LIST)}
                </span>
                <span className="text-sm text-gray-500 font-bold">
                  {formatPrice(service.price)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
