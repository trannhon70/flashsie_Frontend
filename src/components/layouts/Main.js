"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Navbar from "./Navbar";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@nextui-org/react";
import { SessionStore } from "@/config/sesstionStore";

export default function MainLayout({ children }) {
  const router = useRouter();
  const session = useSession();
  const pathname = usePathname();
  // const nonLayout = ["/login", "/signup", "/reset-password", "/api-doc"];

  // if (nonLayout.some((i) => pathname.includes(i))) {
  //   return children;
  // }
  useLayoutEffect(() => {
    if (SessionStore.getUserSession()?.id && pathname === "/") {
      router.replace("/home");
    }
  }, [pathname]);
  if (session.status == "loading") {
    return (
      <div className="flex min-h-screen max-w-[100vw] flex-col items-center justify-center bg-white">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen max-w-[100vw] flex-col bg-white">
      {children}
    </div>
  );
}
