import { getUser } from "@/actions/auth-actions";
import AsideNavBar from "@/components/admin/AsideNavBar";
import { LogInToContinue, NotPermitted } from "@/components/NotAuthorized";
import React from "react";
import HeaderSmallScreen from "@/components/admin/HeaderSmallScreen";
const PERMITTED_ROLES = ["SUPER_ADMIN", "ADMIN", "MODERATOR"];

async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user) return <LogInToContinue />;
  const isPermitted = PERMITTED_ROLES.includes(user.role);
  //   if (!PERMITTED_ROLES.includes(user.role)) return null;

  return (
    <div
      className="flex lg:flex-row flex-col lg:h-dvh lg:overflow-hidden
    transition-all duration-500 ease-in-out max-w-7xl mx-auto w-full
    lg:border-x border-x-gray-200 dark:border-x-gray-800 py-4
    "
    >
      {/* Small screen header */}
      <HeaderSmallScreen />
      {/* Big screen aside */}
      <AsideNavBar />

      {/* main content */}
      {isPermitted ? (
        <main className="lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden w-full pt-2 pb-4 lg:pt-4 px-4 ">
          {children}
        </main>
      ) : (
        <NotPermitted />
      )}
    </div>
  );
}

export default AdminLayout;
