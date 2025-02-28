"use client";

import { columns } from "@/components/commitments/columns";
import { CommitmentDialog } from "@/components/commitments/commitment-dialog";
import { CommitmentFilters } from "@/components/commitments/commitment-filters";
import { DataTable } from "@/components/commitments/data-table";
import NotificationsDialog from "@/components/commitments/notifications-dialog";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api, type PaginatedResponse } from "@/lib/api";
import { Plus } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export default function DashboardPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [commitments, setCommitments] =
    useState<PaginatedResponse<Commitment>>();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [categories, setCategories] = useState<CommitmentCategory[]>([]);
  const [selectedStatusId, setSelectedStatusId] = useState<string>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNotificationDialoOpen, setIsNotificationDialoOpen] = useState(false);
  const [selectedCommitment, setSelectedCommitment] =
    useState<Commitment | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedCommitmentForNotification, setSelectedCommitmentForNotification] = useState<Commitment | null>(null);

  useEffect(() => {
    api
      .getMe()
      .then(setUser)
      .catch(() => setUser(null));
  }, [toast]);

  useEffect(() => {
    if (!user) return;

    Promise.all([api.getStatuses(), api.getCategories()])
      .then(([statusesData, categoriesData]) => {
        setStatuses(statusesData);
        setCategories(categoriesData);
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar filtros",
        })
      );
  }, [toast, user]);

  const handleCreate = async (data: Partial<Commitment>) => {
    try {
      await api.createCommitment(data);
      setIsDialogOpen(false);
      setPage(0);
      toast({
        title: "Sucesso",
        description: "Compromisso criado com sucesso",
      });
      fetchCommitments();
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao criar compromisso",
      });
    }
  };

  const handleUpdate = async (data: Partial<Commitment>) => {
    try {
      await api.updateCommitment(data);
      setIsDialogOpen(false);
      setSelectedCommitment(null);
      setPage(0);
      toast({
        title: "Sucesso",
        description: "Compromisso atualizado com sucesso",
      });
      fetchCommitments();
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar compromisso",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCommitment(id);
      setPage(0);
      toast({
        title: "Sucesso",
        description: "Compromisso deletado com sucesso",
      });
      fetchCommitments();
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao deletar compromisso",
      });
    }
  };

  const handleComplete = async (commitment: Commitment) => {
    const completedStatus = statuses.find(
      (status) => status.name === "Concluido"
    );
    if (!completedStatus) return;

    commitment.status = completedStatus;

    try {
      await api.updateCommitment(commitment);
      toast({
        title: "Sucesso",
        description: "Compromisso marcado como concluído",
      });
      fetchCommitments();
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao marcar compromisso como concluído",
      });
    }
  };

  const handleInProgress = async (commitment: Commitment) => {
    const inProgressStatus = statuses.find(
      (status) => status.name === "Em andamento"
    );
    if (!inProgressStatus) return;

    commitment.status = inProgressStatus;

    try {
      await api.updateCommitment(commitment);
      toast({
        title: "Sucesso",
        description: "Compromisso marcado como em andamento",
      });
      fetchCommitments();
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao marcar compromisso como em andamento",
      });
    }
  };

  const fetchNotifications = async(commitment: Commitment) => {
    try {
      await api.getNotifications(commitment.id, page, pageSize)
        .then((response) => setNotifications(response.content))
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar notificações",
      });
    }
  };

  const refreshNotifications = () => {
    if (selectedCommitmentForNotification) {
      fetchNotifications(selectedCommitmentForNotification)
    }
  }

  const fetchCommitments = useCallback(() => {
    if (!user) return;

    setIsLoading(true);
    api
      .getCommitments({
        userId: user.id,
        page,
        size: pageSize,
        statusId: selectedStatusId,
        commitmentCategoryId: selectedCategoryId,
      })
      .then(setCommitments)
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar compromissos",
        })
      )
      .finally(() => setIsLoading(false));
  }, [
    user,
    page,
    pageSize,
    selectedStatusId,
    selectedCategoryId,
    setIsLoading,
    setCommitments,
    toast,
  ]);

  useEffect(() => {
    if (!user) return;
    fetchCommitments();
  }, [
    user,
    page,
    pageSize,
    selectedStatusId,
    selectedCategoryId,
    fetchCommitments,
  ]);

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Compromissos</h1>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Compromisso
              </Button>
            </div>

            <CommitmentFilters
              statuses={statuses}
              categories={categories}
              selectedStatusId={selectedStatusId}
              selectedCategoryId={selectedCategoryId}
              onStatusChange={setSelectedStatusId}
              onCategoryChange={setSelectedCategoryId}
            />

            <DataTable
              columns={columns({
                statuses,
                onEdit: (commitment) => {
                  setSelectedCommitment(commitment);
                  setIsDialogOpen(true);
                },
                onDelete: handleDelete,
                onComplete: handleComplete,
                onInProgress: handleInProgress,
                onNotification: (commitment) => {
                  setSelectedCommitmentForNotification(commitment)
                  fetchNotifications(commitment)
                  setIsNotificationDialoOpen(true);
                }
              })}
              data={commitments?.content ?? []}
              pageCount={commitments?.totalPages ?? 0}
              pageSize={pageSize}
              page={page}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              isLoading={isLoading}
            />
          </div>
        </div>

        <CommitmentDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          commitment={selectedCommitment}
          categories={categories}
          onSubmit={selectedCommitment ? handleUpdate : handleCreate}
        />

        <NotificationsDialog 
          open={isNotificationDialoOpen} 
          onOpenChange={setIsNotificationDialoOpen} 
          notifications={notifications}
          commitment={selectedCommitmentForNotification}
          refreshNotifications={refreshNotifications}
        />

      </div>
    </ProtectedRoute>
  );
}
