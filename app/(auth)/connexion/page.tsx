import { getUser } from "@/actions/auth-actions";
import AuthForm from "@/components/auth/AuthForm";
import LeftSection from "@/components/auth/LeftSection";
import { redirect } from "next/navigation";
import React from "react";

const AuthPage = async () => {
  const user = await getUser();
  if (user) {
    redirect("/");
  }

  return (
    <main
      className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto 
    bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden"
    >
      {/* Left section: image / illustration / branding */}
      <LeftSection />

      {/* Right section: auth form */}
      <section className="flex-1 flex items-center justify-center p-8 md:p-12">
        <AuthForm />
      </section>
    </main>
  );
};

export default AuthPage;
