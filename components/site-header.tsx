"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, Bolt, Mail, ChartColumn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthStatus } from "@/components/auth-status";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn, isAuthenticatedUserAdmin } from "@/lib/utils";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      setIsAdmin(await isAuthenticatedUserAdmin());
    };

    checkAdmin();
  }, []);

  const routes = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/report", label: "Relatórios", icon: ChartColumn },
    {href: "/invitations", label: "Convites", icon: Mail},
    ...(isAdmin
      ? [{ href: "/adminPanel", label: "Painel Administrativo", icon: Bolt }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader className="border-b pb-4 mb-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-3">
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                        pathname === route.href ? "bg-accent" : "transparent"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {route.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="hidden lg:flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span className="font-semibold">Dashboard</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === route.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
