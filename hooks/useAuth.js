"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(redirectIfAuth = false) {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !redirectIfAuth) {
      router.push("/login");
    }
    if (!isLoading && isAuthenticated && redirectIfAuth) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, redirectIfAuth, router]);

  return { user, isAuthenticated, isLoading };
}