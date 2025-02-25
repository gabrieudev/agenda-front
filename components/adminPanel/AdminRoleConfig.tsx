import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface AdminRoleConfigProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
}

export default function AdminRoleConfig({
  roles,
  setRoles,
  page,
  setPage,
  size,
  setSize,
}: AdminRoleConfigProps) {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] =
    useState<Role | null>(null);
  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

  const [newRole, setNewRole] = useState<Role>({
    id: "",
    name: "",
    description: "",
  });
  


  const handleAddRole = () => {
    if (!newRole.name.trim() || !newRole.description.trim()) return;

    api
      .createRole({
        name: newRole.name,
        description: newRole.description,
      })
      .then((data) => {
        setRoles([...roles, data]);
        setNewRole({ id: "", name: "", description: "" });
        setIsDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Papel adicionado com sucesso",
        });
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao adicionar papel",
        })
      );
  };
  
  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setNewRole({ ...role });
    setIsDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (!newRole.name.trim() || !newRole.description.trim()) return;

    api.updateRole({
      id: newRole.id,
      name: newRole.name,
      description: newRole.description
    })
    .then(() => {
      setRoles(
        roles.map((r) =>
          r.id === newRole.id ? newRole : r
       )
      );
      setEditingRole(null);
      setNewRole({ id: "", name: "", description: "" });
        setIsDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Papel atualizado com sucesso",
        });
    })
    .catch(() => 
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar papel",
      })
    )

  }

  const handleDeleteRole = (roleId: string) => {
    api
      .deleteRole(roleId)
      .then(() => {
        setRoles(roles.filter((r) => r.id !== roleId));
        toast({
          title: "Sucesso",
          description: "Papel removido com sucesso",
        });
      })
      .catch((error) =>
        console.log(error)
        
      );
  };

  return (
    <>
      <Button className="mt-4" 
        onClick={() => {
          setNewRole({ id: "", name: "", description: "" });
          setIsDialogOpen(true); 
          setEditingRole(null);
        }}
      >Novo Papel</Button>
      <Card className="mt-4 max-w-4xl">
        <CardContent className="p-6 space-y-4">
          {roles.length > 0 ? (
            <ul className="space-y-2">
              {roles.map((role) => (
                <li
                  key={role.id}
                  className="p-4 rounded-md border border-border bg-card flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{role.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost" onClick={() =>handleEditRole(role)}>
                      <Pencil className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteRole(role.id)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Nenhuma categoria encontrada.
            </p>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between mt-4 max-w-4xl">
        <Button onClick={handlePreviousPage} disabled={page === 0}>
          Anterior
        </Button>
        <Button onClick={handleNextPage}>Próximo</Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRole ? "Editar Papel" : "Novo Papel"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Nome</Label>
            <Input 
              value={newRole.name}
              placeholder="Digite o nome do papel" 
              onChange={(e) => 
                setNewRole({...newRole, name: e.target.value})
              }
            />
            <Label>Descrição</Label>
            <Textarea 
              value={newRole.description}
              onChange={(e) => 
                setNewRole({...newRole, description: e.target.value})
              }
              placeholder="Digite a descrição do papel" 
            />
          </div>
          <DialogFooter>
            <Button
              onClick={
                editingRole ? handleUpdateRole : handleAddRole
              }
            >
              {editingRole ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
