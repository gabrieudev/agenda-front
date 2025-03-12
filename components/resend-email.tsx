"use client";

import { Loader, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  userId: string;
}

export default function ResendEmailComponent({ userId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleResendEmail = () => {
    api
      .resendEmail(userId)
      .then(() => {
        setLoading(false)
        router.push("/");
        toast({
          title: "Sucesso",
          description: "Email de confirmação reenviado",
        });
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao reenviar email",
        })
      );
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Sua conta ainda não foi ativada
          </h1>
          <p className="text-sm text-muted-foreground">
            Clique no botão abaixo para reenviar o email de confirmação para o
            endereço cadastrado
          </p>
          <div className="flex justify-center mt-4">
            <Button
              size="icon"
              variant="ghost"
              aria-label="Teste"
              disabled={loading}
              onClick={() => {
                handleResendEmail(); setLoading(true)
              }}
            >
              {loading ? (<Loader></Loader>) : (<Mail className="w-10 h-10" />)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
