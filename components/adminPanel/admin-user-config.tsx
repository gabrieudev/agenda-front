"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Pencil, Trash2, X } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

interface AdminUserConfigProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  searchParam: string;
  setSearchParam: React.Dispatch<React.SetStateAction<string>>;
}

export default function AdminUserConfig({
  users,
  setUsers,
  page,
  setPage,
  size,
  setSize,
  searchParam,
  setSearchParam,
}: AdminUserConfigProps) {
  const [newUser, setNewUser] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [roleQuery, setRoleQuery] = useState("");
  const [userToBeDeletedId, setUserToBeDeletedId] = useState("");

  useEffect(() => {
    api
      .getUsers(page, size, searchParam)
      .then((response) => setUsers(response.content))
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar usuários",
        })
      );
  }, [page, size, searchParam, setUsers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParam(e.target.value);
    setPage(0);
  };

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 0));

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser(user);
    setIsDialogOpen(true);
    api
      .getRoles(0, 10, user.id)
      .then((response) => setUserRoles(response))
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar papéis do usuário",
        })
      );
    api
      .getRoles(0, 10)
      .then((response) => setAllRoles(response.content))
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar todos os papéis",
        })
      );
  };

  const addRole = (role: Role) => {
    if (!userRoles.some((r) => r.id === role.id)) {
      api
        .assignRole([role], newUser.id)
        .then(() => setUserRoles([...userRoles, role]));
    }
    setRoleQuery("");
  };

  const removeRole = (role: Role) => {
    api
      .unassignRole([role], newUser.id)
      .then(() => setUserRoles(userRoles.filter((r) => r.id !== role.id)))
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao remover papel do usuário",
        })
      );
  };

  const handleUpdateUser = () => {
    if (
      !newUser.firstName.trim() ||
      !newUser.lastName.trim() ||
      !newUser.email.trim()
    )
      return;

    api
      .updateUser(newUser)
      .then(() => {
        setUsers(users.map((u) => (u.id === newUser.id ? newUser : u)));
        setEditingUser(null);
        setNewUser({
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          updatedAt: new Date(),
        });
        setIsDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso",
        });
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao atualizar usuário",
        })
      );
  };

  const handleDeleteUser = (userId: string) => {
    api
      .deleteUser(userId)
      .then(() => {
        setUsers(users.filter((u) => u.id !== userId));
        toast({
          title: "Sucesso",
          description: "Usuário removido com sucesso",
        });
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao remover usuário",
        })
      );
  };

  const handleDeleteUserConfirmation = (userId: string) => {
    setUserToBeDeletedId(userId);
    setIsAlertDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mt-4 max-w-4xl">
        <Input
          value={searchParam}
          onChange={handleSearchChange}
          placeholder="Buscar usuário"
        />
      </div>
      <Card className="mt-4 max-w-4xl">
        <CardContent className="p-6 space-y-4">
          {users.length > 0 ? (
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
                      onClick={() => handleEditUser(user)}
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteUserConfirmation(user.id)}
                    >
                      <Trash2 className="w-5 h-5" />
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
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Nome</Label>
            <Input
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
              placeholder="Digite o primeiro nome"
            />
            <Label>Sobrenome</Label>
            <Input
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
              placeholder="Digite o sobrenome"
            />
            <Label>Email</Label>
            <Input
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="Digite o email"
            />
            <Label>Senha</Label>
            <Input
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              placeholder="Digite a senha"
            />
            <Label>Papéis</Label>
            <Command>
              <CommandInput
                placeholder="Buscar papéis..."
                value={roleQuery}
                onValueChange={setRoleQuery}
              />
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <CommandList>
                  {allRoles
                    .filter(
                      (role) =>
                        role.name
                          .toLowerCase()
                          .includes(roleQuery.toLowerCase()) &&
                        userRoles &&
                        !userRoles.some((r) => r.id === role.id)
                    )
                    .map((role) => (
                      <CommandItem key={role.id} onSelect={() => addRole(role)}>
                        {role.name}
                      </CommandItem>
                    ))}
                </CommandList>
              </ScrollArea>
              <div className="flex flex-wrap gap-2 p-2">
                {userRoles.map((role) => (
                  <Badge
                    key={role.id}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {role.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-4 h-4 p-0 ml-1 hover:bg-red-200"
                      onClick={() => removeRole(role)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </Command>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateUser}>Atualizar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser revertida. O usuário será removido
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteUser(userToBeDeletedId);
                setUserToBeDeletedId("");
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
