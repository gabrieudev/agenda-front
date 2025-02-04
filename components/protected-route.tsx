"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!authService.isAuthenticated()) {
        router.push("/auth/signin");
      }
    };

    checkAuthentication();
  }, [router]);

  if (!authService.isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
}
