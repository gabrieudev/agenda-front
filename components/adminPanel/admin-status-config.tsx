import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";


interface AdminStatusConfigProps {
  statuses: Status[];
  setStatuses: React.Dispatch<React.SetStateAction<Status[]>>;
}

export default function AdminStatusConfig({ statuses, setStatuses }: AdminStatusConfigProps) {
  const [newStatus, setNewStatus] = useState<Status>({ id: "", name: "", description: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);

  const handleAddStatus = () => {
    if (!newStatus.name.trim() || !newStatus.description.trim()) return;

    api.createStatus({ name: newStatus.name, description: newStatus.description })
      .then((data) => {
        setStatuses([...statuses, data]);
        setNewStatus({ id: "", name: "", description: "" });
        setIsDialogOpen(false);
        toast({ title: "Sucesso", description: "Status adicionado com sucesso" });
      })
      .catch(() => toast({ variant: "destructive", title: "Erro", description: "Erro ao adicionar status" }));
  };

  const handleEditStatus = (status: Status) => {
    setEditingStatus(status);
    setNewStatus({ ...status });
    setIsDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!newStatus.name.trim() || !newStatus.description.trim()) return;

    api.updateStatus(newStatus)
      .then(() => {
        setStatuses(statuses.map((s) => (s.id === newStatus.id ? newStatus : s)));
        setEditingStatus(null);
        setNewStatus({ id: "", name: "", description: "" });
        setIsDialogOpen(false);
        toast({ title: "Sucesso", description: "Status atualizado com sucesso" });
      })
      .catch(() => toast({ variant: "destructive", title: "Erro", description: "Erro ao atualizar status" }));
  };

  const handleDeleteStatus = (statusId: string) => {
    api.deleteStatus(statusId)
      .then(() => {
        setStatuses(statuses.filter((s) => s.id !== statusId));
        toast({ title: "Sucesso", description: "Status removido com sucesso" });
      })
      .catch(() => toast({ variant: "destructive", title: "Erro", description: "Erro ao remover status" }));
  };

  return (
    <>
      <Button className="mt-4" onClick={() => { setNewStatus({ id: "", name: "", description: "" }); setEditingStatus(null); setIsDialogOpen(true); }}>Novo Status</Button>
      <Card className="mt-4 max-w-4xl">
        <CardContent className="p-6 space-y-4">
          {statuses.length > 0 ? (
            <ul className="space-y-2">
              {statuses.map((status) => (
                <li key={status.id} className="p-4 rounded-md border border-border bg-card flex justify-between items-center">
                  <div>
                    <p className="font-bold">{status.name}</p>
                    <p className="text-sm text-muted-foreground">{status.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEditStatus(status)}><Pencil className="w-5 h-5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteStatus(status.id)}><Trash2 className="w-5 h-5" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">Nenhum status encontrado.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStatus ? "Editar Status" : "Novo Status"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Nome</Label>
            <Input value={newStatus.name} onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })} placeholder="Digite o nome do status" />
            <Label>Descrição</Label>
            <Input value={newStatus.description} onChange={(e) => setNewStatus({ ...newStatus, description: e.target.value })} placeholder="Digite a descrição do status" />
          </div>
          <DialogFooter>
            <Button onClick={editingStatus ? handleUpdateStatus : handleAddStatus}>{editingStatus ? "Atualizar" : "Criar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
