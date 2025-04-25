"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetUser from "@/hooks/useGetUser";
import Link from "next/link";
import AvatarComponent from "../AvatarComponent";
import { CreditCard, FolderDot, LogOut, User, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HOME_LINKS } from "@/utils/data";

function HomeProfileMenu() {
  const { user } = useGetUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AvatarComponent />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user && user.role.includes("ADMIN") && (
          <DropdownMenuItem>
            <Link href="/overview" className="flex items-center gap-2">
              <FolderDot className="size-4 mr-2" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <User className="size-4 mr-2" />
          <span>Profile</span>
        </DropdownMenuItem>
        {user && user.role.includes("PERSONNEL") && (
          <DropdownMenuItem>
            <Users className="size-4 mr-2" />
            <span>Personnels</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <CreditCard className="size-4 mr-2" />
          <span>Mes reservations</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
          <LogOut className="size-4 mr-2" />
          <span>Deconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const HomeProfileAccordionSmallScreen = () => {
  const { user } = useGetUser();

  if (!user) return null;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-xl font-medium pl-2 underline underline-offset-2">
          Mon espace
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1">
          {/* Protected links */}
          {HOME_LINKS.filter((link) => link.isProtected)
            .filter(
              (link) =>
                !link.role || link.role.some((r) => user?.role?.includes(r))
            )
            .map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="p-2 hover:opacity-70 hover:underline underline-offset-2
              transition-all duration-500 ease-in-out
              font-medium text-xl
              "
              >
                {link.title}
              </Link>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { HomeProfileMenu, HomeProfileAccordionSmallScreen };
