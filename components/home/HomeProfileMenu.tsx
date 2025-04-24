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
            <Link href="/dashboard" className="flex items-center gap-2">
              <FolderDot className="size-4 mr-2" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <User className="size-4 mr-2" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Users className="size-4 mr-2" />
          <span>Personnels</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="size-4 mr-2" />
          <span>Subscription </span>
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

export default HomeProfileMenu;
