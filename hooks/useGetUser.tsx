"use client";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const useGetUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setUser(session.user as User);
    } else {
      setUser(null);
    }
  }, [session, status]);

  return { user, setUser, status };
};

export default useGetUser;
