import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface InviteProps {
  notification: Notification | undefined;
  users: User[] | null;
  onSearchChange: (searchParam: string) => void;
}

export default function Invite({
  notification,
  users,
  onSearchChange,
}: InviteProps) {
  const handleCreateInvitation = (user: User) => {
    const body: Partial<NotificationInvitation> = {
      user: user,
      notification: notification,
    };
    api.createNotificationInvitation(body).then(() =>
      toast({
        title: "Sucesso",
        description: "Convite enviado",
      })
    ).catch(() => toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar convite",
      }));
  };

  return (
    <>
      <div className="flex justify-between items-center mt-4 max-w-4xl">
        <Input
          //   value={searchParam}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar usuário"
        />
      </div>
      <Card className="mt-4 max-w-4xl">
        <CardContent className="p-6 space-y-4">
          {users && users.length > 0 ? (
            <ul className="space-y-2">
              {users.map((user) => (
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
