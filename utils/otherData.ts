import maid from "@/public/images/maid1.jpg";
import cooker from "@/public/images/cleaning2.jpg";
import driver from "@/public/images/driver1.jpg";
import guard from "@/public/images/guard1.jpg";
import plumber from "@/public/images/plumber1.jpg";
import electrician from "@/public/images/electrician1.jpg";
import mason from "@/public/images/mason1.jpg";
import painter from "@/public/images/painter1.jpg";
import carpenter from "@/public/images/service1.jpg";

const ROLES_LIST = [
  { label: "Client", value: "CLIENT" },
  { label: "Client", value: "USER" },
  { label: "Administrateur", value: "ADMIN" },
  { label: "Super Administrateur", value: "SUPER_ADMIN" },
  { label: "Modérateur", value: "MODERATOR" },
];

const JOBS_LIST = [
  { label: "Femme de menage", value: "maid" },
  { label: "Cuisinier.ère", value: "cooker" },
  { label: "Chauffeur", value: "driver" },
  { label: "Sentinelle(gardien)", value: "guard" },
  { label: "Plombier.ère", value: "plumber" },
  { label: "Electricien.ne", value: "electrician" },
  { label: "Maçon", value: "mason" },
  { label: "Peintre", value: "painter" },
  { label: "Menuisier.ère", value: "carpenter" },
];

const SERVICES_LIST = [
  {
    name: "Nettoyage de maison",
    service: "maid",
    description:
      "Service de nettoyage complet de votre maison incluant dépoussiérage, lavage des sols et sanitaires",
    price: 50,
    duration: "monthly",
    image: maid,
    stayHome: true,
  },
  {
    name: "Repas à domicile",
    service: "cooker",
    description:
      "Préparation de repas équilibrés et personnalisés selon vos préférences",
    price: 30,
    duration: "monthly",
    image: cooker,
    stayHome: true,
  },
  {
    name: "Transport privé",
    service: "driver",
    description:
      "Service de chauffeur privé pour vos déplacements personnels ou professionnels",
    price: 40,
    duration: "monthly",
    image: driver,
    stayHome: true,
  },
  {
    name: "Surveillance résidentielle",
    service: "guard",
    description:
      "Service de gardiennage 24/7 pour votre propriété, Besoin d'un gardien pour votre maison ou votre entreprise.",
    price: 2000,
    duration: "monthly",
    image: guard,
    stayHome: true,
  },
  {
    name: "Dépannage plomberie",
    service: "plumber",
    description:
      "Intervention rapide pour tous types de problèmes de plomberie de votre maison.",
    price: 80,
    duration: "once",
    image: plumber,
    stayHome: false,
  },
  {
    name: "Installation électrique",
    service: "electrician",
    description:
      "Installation et maintenance de systèmes électriques de votre maison.",
    price: 100,
    duration: "once",
    image: electrician,
    stayHome: false,
  },
  {
    name: "Construction mur",
    service: "mason",
    description:
      "Construction de murs et structures en maçonnerie, Besoin de mains d'oeuvre pour votre construction personnelle.",
    price: 150,
    duration: "hourly",
    image: mason,
    stayHome: false,
  },
  {
    name: "Peinture intérieure",
    service: "painter",
    description:
      "Service de peinture pour l'intérieur ou l'exterieur de votre maison.",
    price: 120,
    duration: "hourly",
    image: painter,
    stayHome: false,
  },
  {
    name: "Fabrication meuble sur mesure",
    service: "carpenter",
    description:
      "Création de meubles personnalisés selon vos besoins Ou besoins d'un menuisier pour vos differents taches de maison.",
    price: 300,
    duration: "once",
    image: carpenter,
    stayHome: false,
  },
];

const DURATION_LIST = [
  { label: "Une fois", value: "once" },
  { label: "Heure", value: "hourly" },
  { label: "Jour", value: "daily" },
  { label: "Semaine", value: "weekly" },
  { label: "Mois", value: "monthly" },
  { label: "Annee", value: "yearly" },
  { label: "Autre", value: "other" },
];

const DAY_LIST = [
  { label: "Lundi", value: "monday" },
  { label: "Mardi", value: "tuesday" },
  { label: "Mercredi", value: "wednesday" },
  { label: "Jeudi", value: "thursday" },
  { label: "Vendredi", value: "friday" },
  { label: "Samedi", value: "saturday" },
  { label: "Dimanche", value: "sunday" },
];

const STATUS_LIST = [
  { label: "En attente", value: "pending" },
  { label: "En cours", value: "in_progress" },
  { label: "Terminé", value: "completed" },
  { label: "Reporté", value: "rescheduled" },
  { label: "Annulé", value: "cancelled" },
];

export {
  JOBS_LIST,
  SERVICES_LIST,
  DURATION_LIST,
  ROLES_LIST,
  DAY_LIST,
  STATUS_LIST,
};
