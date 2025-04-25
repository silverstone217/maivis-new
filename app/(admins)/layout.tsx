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
      className="flex lg:flex-row flex-col w-full lg:h-dvh lg:overflow-hidden
    transition-all duration-500 ease-in-out
    "
    >
      {/* Small screen header */}
      <HeaderSmallScreen />
      {/* Big screen aside */}
      <AsideNavBar />

      {/* main content */}
      {isPermitted ? (
        <main className="lg:flex-1 lg:overflow-y-auto lg:overflow-x-hidden p-4">
          {children}
        </main>
      ) : (
        <NotPermitted />
      )}
    </div>
  );
}

export default AdminLayout;
