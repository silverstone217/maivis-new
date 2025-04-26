import img1 from "@/public/images/cleaning1.jpg";
import img2 from "@/public/images/cleaning2.jpg";
import img3 from "@/public/images/driver1.jpg";
import {
  CalendarCheck,
  ChartNoAxesGantt,
  HandPlatter,
  Shield,
  Users,
  UsersRound,
} from "lucide-react";

const AUTH_CONTENT = [
  {
    id: 1,
    title: "Bienvenue sur Maivis",
    description:
      "Maivis est une application de réservation de services de maison fait par des professionnels.",
    image: img1,
  },
  {
    id: 2,
    title: "Trouvez ce dont vous avez besoin",
    description:
      "Maivis garantie la qualité de ses services et de ses professionnels",
    image: img2,
  },
  {
    id: 3,
    title: "Réservez un service facilement et rapidement",
    description:
      "Réservez un service en quelques clics et profitez de la qualité de nos services",
    image: img3,
  },
];

const HOME_LINKS = [
  {
    id: 1,
    title: "Accueil",
    href: "/",
    isProtected: false,
  },
  {
    id: 2,
    title: "Services",
    href: "/services",
    isProtected: false,
  },

  {
    id: 3,
    title: "A propos",
    href: "/a-propos",
    isProtected: false,
  },
  {
    id: 4,
    title: "Contact",
    href: "/contact",
    isProtected: false,
  },
  {
    id: 5,
    title: "Dashboard",
    href: "/overview",
    isProtected: true,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    id: 6,
    title: "Mes reservations",
    href: "/mes-reservations",
    isProtected: true,
    role: ["USER"],
  },
  {
    id: 7,
    title: "Personnels",
    href: "/personnels",
    isProtected: true,
    role: ["PERSONNEL"],
  },
  {
    id: 8,
    title: "Profil",
    href: "/profil",
    isProtected: true,
  },
];

const ADMIN_LINKS = [
  {
    id: 1,
    title: "Dashboard",
    href: "/overview",
    icon: ChartNoAxesGantt,
  },
  {
    id: 2,
    title: "Personnels",
    href: "/personnels",
    icon: UsersRound,
  },
  {
    id: 3,
    title: "Reservations",
    href: "/reservations",
    icon: CalendarCheck,
  },
  {
    id: 4,
    title: "Services",
    href: "/gestion-services",
    icon: HandPlatter,
  },
  {
    id: 5,
    title: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    id: 6,
    title: "Administrateurs",
    href: "/admins",
    icon: Shield,
  },
];

const ROLES = [
  {
    id: 1,
    title: "ADMIN",
    description: "Administrateur",
  },
  {
    id: 2,
    title: "SUPER_ADMIN",
    description: "Super Administrateur",
  },
  {
    id: 3,
    title: "PERSONNEL",
    description: "Personnel",
  },
  {
    id: 4,
    title: "CLIENT",
    description: "Client",
  },
  {
    id: 5,
    title: "MODERATOR",
    description: "Modérateur",
  },
  {
    id: 6,
    title: "USER",
    description: "Utilisateur",
  },
];

export { HOME_LINKS, AUTH_CONTENT, ADMIN_LINKS, ROLES };
