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
    <div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 md:h-screen max-w-7xl mx-auto p-4 
      transition-all duration-500 ease-in-out
      "
      >
        {/* left section */}
        <LeftSection />
        {/* right section form */}
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
