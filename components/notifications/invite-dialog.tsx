import { Send, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface InviteProps {
  notification: Notification | undefined;
  users: User[] | null;
  onSearchChange: (searchParam: string) => void;
  invitations: NotificationInvitation[] | undefined;
  onRefreshInvitations: () => void;
}

export default function Invite({
  notification,
  invitations,
  users,
  onSearchChange,
  onRefreshInvitations,
}: InviteProps) {
  const handleCreateInvitation = (user: User) => {
    const body: Partial<NotificationInvitation> = {
      user: user,
      notification: notification,
    };
    api
      .createNotificationInvitation(body)
      .then(() => {
        toast({
          title: "Sucesso",
          description: "Convite enviado",
        });
        onRefreshInvitations();
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao enviar convite",
        })
      );
  };

  const handleDeleteInvite = (invitationId: string) => {
    api
      .deleteNotificationInvitation(invitationId)
      .then(() => {
        toast({
          title: "Sucesso",
          description: "Convite removido",
        });
        onRefreshInvitations();
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao remover convite",
        })
      );
  };

  const invitedUserIds = new Set(invitations?.map((invite) => invite.user.id));

  const availableUsers =
    users?.filter((user) => !invitedUserIds.has(user.id)) || [];

  return (
    <>
      {invitations && invitations.length > 0 ? (
        <ul className="space-y-2">
          {invitations.map((invitation) => (
            <li
              key={invitation.id}
              className="p-4 rounded-md border border-border bg-card flex justify-between items-center"
            >
              <div>
                <p className="font-bold">
                  {invitation.user.firstName} {invitation.user.lastName}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteInvite(invitation.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">Nenhum convite encontrado.</p>
      )}

      <Card className="mt-4 max-w-4xl ">
        <h3 className="mt-4 ml-6">Convidar usuário</h3>
        <div className="flex justify-between items-center mt-4 ml-6 mr-6">
          <Input
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar usuário"
          />
        </div>
        <CardContent className="p-6 space-y-4">
          {availableUsers && availableUsers.length > 0 ? (
            <ul className="space-y-2">
              {availableUsers.map((user) => (
                <li
                  key={user.id}
                  className="p-4 rounded-md border border-border bg-card flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCreateInvitation(user)}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
