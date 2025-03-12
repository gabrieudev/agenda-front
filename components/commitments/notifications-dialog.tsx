import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { MoveLeft, Pencil, Share2, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import Invite from "../notifications/invite-dialog";

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  commitment: Commitment | null;
  refreshNotifications: () => void;
}

export default function NotificationsDialog({
  open,
  onOpenChange,
  notifications,
  commitment,
  refreshNotifications,
}: NotificationsDialogProps) {
  const [view, setView] = useState<"list" | "edit" | "create" | "invite">(
    "list"
  );
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [message, setMessage] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [usersPage, setUsersPage] = useState<number>(0);
  const [usersPageSize, setUsersPageSize] = useState(10);
  const [searchParam, setSearchParam] = useState("");
  const [activeNotification, setActiveNotification] = useState<
    Notification | undefined
  >(undefined);
  const [activeNotificationInvitations, setActiveNotificationInvitations] =
    useState<NotificationInvitation[] | undefined>(undefined);
  const [invitationsPage, setInvitationsPage] = useState<number>(0);
  const [invitatationsPageSize, setInvitatationsPageSize] = useState(10);

  useEffect(() => {
    api
      .getUsers(usersPage, usersPageSize, searchParam)
      .then((response) => setUsers(response.content));
  }, [usersPage, usersPageSize, searchParam, setUsers]);

  useEffect(() => {
    if (activeNotification) {
      console.log("teste");

      api
        .getAllNotificationInvitations(
          invitationsPage,
          invitatationsPageSize,
          undefined,
          undefined,
          activeNotification.id
        )
        .then((response) => setActiveNotificationInvitations(response.content));
    }
  }, [
    activeNotification,
    invitationsPage,
    invitatationsPageSize,
    setActiveNotificationInvitations,
  ]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitment || !dueDate) return;

    const adjustedDueDate = new Date(
      dueDate.getTime() - dueDate.getTimezoneOffset() * 60000
    ).toISOString();

    await api
      .createNotification({ message, dueDate: adjustedDueDate, commitment })
      .then(() =>
        toast({
          title: "Sucesso",
          description: "Notificação criada com sucesso",
        })
      )
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao criar notificação",
        })
      );
    setMessage("");
    setDueDate(null);
    setView("list");
    refreshNotifications();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNotification || !dueDate) return;

    const adjustedDueDate = new Date(
      dueDate.getTime() - dueDate.getTimezoneOffset() * 60000
    ).toISOString();

    await api
      .updateNotification({
        ...selectedNotification,
        message,
        dueDate: adjustedDueDate,
      })
      .then(() =>
        toast({
          title: "Sucesso",
          description: "Notificação atualizada com sucesso",
        })
      )
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao atualizar notificação",
        })
      );
    setView("list");
    refreshNotifications();
  };

  const handleDelete = async (id: string) => {
    await api
      .deleteNotification(id)
      .then(() =>
        toast({
          title: "Sucesso",
          description: "Notificação removida com sucesso",
        })
      )
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao remover notificação",
        })
      );
    refreshNotifications();
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setDueDate(date);
  };

  const handleSearchChange = (param: string) => {
    setSearchParam(param);
  };

  const handleRefreshInvitations = () => {
    if (activeNotification) {
      api
        .getAllNotificationInvitations(
          invitationsPage,
          invitatationsPageSize,
          undefined,
          undefined,
          activeNotification.id
        )
        .then((response) => setActiveNotificationInvitations(response.content))
        .catch(() =>
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Erro ao atualizar convites",
          })
        );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) setView("list");
        onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {view == "invite" && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setView("list");
                }}
                className="mr-2" 
              >
                <MoveLeft className="w-5 h-5" />
              </Button>
            )}
            {view === "list"
              ? "Notificações"
              : view === "invite"
              ? "Convites"
              : view === "edit"
              ? "Editar Notificação"
              : "Criar Notificação"}
          </DialogTitle>
        </DialogHeader>
        {view === "list" ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex justify-between p-2 border rounded-lg items-center"
                >
                  <span className="flex-1 break-words mr-2 overflow-hidden text-ellipsis">
                    {notif.message} - {new Date(notif.dueDate).toLocaleString()}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setView("edit");
                        setSelectedNotification(notif);
                        setMessage(notif.message);
                        setDueDate(new Date(notif.dueDate));
                      }}
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(notif.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setActiveNotification(notif);
                        setView("invite");
                      }}
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Nenhuma notificação encontrada
              </p>
            )}
            <Button
              className="mt-2 w-full"
              onClick={() => {
                setView("create");
                setMessage("");
                setDueDate(null);
              }}
            >
              Criar Notificação
            </Button>
          </div>
        ) : view === "invite" ? (
          <Invite
            notification={activeNotification}
            onSearchChange={handleSearchChange}
            users={users}
            invitations={activeNotificationInvitations}
            onRefreshInvitations={handleRefreshInvitations}
          ></Invite>
        ) : (
          <form
            onSubmit={view === "create" ? handleCreate : handleEdit}
            className="space-y-4"
          >
            <Label>Mensagem</Label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a mensagem da notificação"
            />
            <Label>Data de Recebimento</Label>
            <Input
              type="datetime-local"
              value={
                dueDate
                  ? new Date(
                      dueDate.getTime() - dueDate.getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={handleDueDateChange}
              placeholder="Data de vencimento"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setView("list")}>
                Cancelar
              </Button>
              <Button type="submit">
                {view === "create" ? "Criar" : "Salvar"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
