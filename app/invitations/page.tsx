"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function ReceivedInvitationsList() {
  const [invitations, setInvitations] = useState<
    NotificationInvitation[] | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [user, setUser] = useState<User | null>(null);
  const [selectedInvitation, setSelectedInvitation] =
    useState<NotificationInvitation | null>(null);
  const [statuses, setStatuses] = useState<Status[] | null>(null);

  useEffect(() => {
    async function fetchAuthenticatedUser() {
      api.getMe().then((data) => setUser(data));
    }

    fetchAuthenticatedUser();
  }, [setUser]);

  useEffect(() => {
    async function fetchInvitations() {
      try {
        const response = await api.getAllNotificationInvitations(
          page,
          size,
          user ? user.id : undefined
        );
        setInvitations(response.content);
      } catch (error) {
        console.error("Erro ao buscar convites:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchInvitations();
    }
  }, [user, page, size]);

  useEffect(() => {
    async function fetchStatuses() {
      api
        .getStatuses()
        .then((data) => setStatuses(data))
        .catch(() =>
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Erro ao carregar lista de status",
          })
        );
    }

    fetchStatuses();
  }, [setStatuses]);

  let completedStatus: Status | undefined = statuses?.find(
    (status) => status.name === "Concluido"
  );

  const handleAcceptInvitation = (invitationId: string) => {
    const body: Partial<NotificationInvitation> = {
      id: invitationId,
      status: completedStatus,
    };

    api
      .updateNotificationInvitation(body)
      .then(() =>
        toast({
          title: "Sucesso",
          description: "Convite aceito",
        })
      )
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao aceitar convite",
        })
      );
  };

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <Card className="rounded-lg border p-8 bg-card text-card-foreground shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Convites recebidos</h1>
          {loading ? (
            <p className="text-center text-lg">Carregando...</p>
          ) : invitations && invitations.length > 0 ? (
            <ul className="space-y-4">
              {invitations.map((invitation) => (
                <li key={invitation.id}>
                  <Card className="p-4 border rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {invitation.notification.commitment.user.firstName}{" "}
                          {invitation.notification.commitment.user.lastName}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {invitation.notification.title}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              color="blue"
                              onClick={() => setSelectedInvitation(invitation)}
                            >
                              Detalhes
                            </Button>
                          </DialogTrigger>
                          {selectedInvitation &&
                            selectedInvitation.id === invitation.id && (
                              <DialogContent>
                                <DialogTitle>Detalhes do Convite</DialogTitle>
                                <div className="text-sm text-muted-foreground">
                                  <div className="space-y-2">
                                    <div>
                                      <strong>Convite de:</strong>{" "}
                                      {
                                        invitation.notification.commitment.user
                                          .firstName
                                      }{" "}
                                      {
                                        invitation.notification.commitment.user
                                          .lastName
                                      }
                                    </div>
                                    <div>
                                      <strong>Título do Compromisso:</strong>{" "}
                                      {invitation.notification.commitment.title}
                                    </div>
                                    <div>
                                      <strong>Mensagem:</strong>{" "}
                                      {invitation.notification.message}
                                    </div>
                                    <div>
                                      <strong>
                                        Data de envio da notificação:
                                      </strong>{" "}
                                      {invitation.notification.dueDate.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="ghost"
                                    color="green"
                                    onClick={() =>
                                      handleAcceptInvitation(invitation.id)
                                    }
                                  >
                                    Aceitar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    color="red"
                                    onClick={() => setSelectedInvitation(null)}
                                  >
                                    Fechar
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            )}
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          color="green"
                          disabled={
                            invitation.status.name === "Concluido"
                              ? true
                              : false
                          }
                          onClick={() => handleAcceptInvitation(invitation.id)}
                        >
                          Aceitar
                        </Button>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-lg">Nenhum convite recebido.</p>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
