"use client";

import { Github } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="w-full flex h-16 items-center justify-between px-4">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Agenda Digital. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/gabrieudev/agenda"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
