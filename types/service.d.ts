import { StaticImageData } from "next/image";

export type Role = {
  label: string;
  value: "CLIENT" | "USER" | "ADMIN" | "SUPER_ADMIN" | "MODERATOR";
};

export type Job = {
  label: string;
  value:
    | "maid"
    | "cooker"
    | "driver"
    | "guard"
    | "plumber"
    | "electrician"
    | "mason"
    | "painter"
    | "carpenter";
};

export type Duration = {
  label: string;
  value:
    | "once"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "other";
};

export type ServiceType = {
  name: string;
  service: Job["value"];
  description: string;
  price: number;
  duration: Duration["value"];
  image: string | StaticImageData;
};

export type ServiceData = {
  ROLES_LIST: Role[];
  JOBS_LIST: Job[];
  SERVICES_LIST: Service[];
  DURATION_LIST: Duration[];
};
