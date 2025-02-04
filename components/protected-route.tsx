"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const isAuthenticated = await authService.isAuthenticated();

      if (!isAuthenticated) {
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
