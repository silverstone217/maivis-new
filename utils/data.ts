import img1 from "@/public/images/cleaning1.jpg";
import img2 from "@/public/images/cleaning2.jpg";
import img3 from "@/public/images/driver1.jpg";

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
    title: "Contact",
    href: "/contact",
    isProtected: false,
  },
  {
    id: 4,
    title: "A propos",
    href: "/a-propos",
    isProtected: false,
  },
  {
    id: 5,
    title: "Dashboard",
    href: "/overview",
    isProtected: true,
  },
];

export { HOME_LINKS, AUTH_CONTENT };
