import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface AdminCategoryConfigProps {
  categories: CommitmentCategory[];
  setCategories: React.Dispatch<React.SetStateAction<CommitmentCategory[]>>;
}

export default function AdminCategoryConfig({
  categories,
  setCategories,
}: AdminCategoryConfigProps) {
  const [newCategory, setNewCategory] = useState<CommitmentCategory>({
    id: "",
    name: "",
    description: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CommitmentCategory | null>(null);

  const handleAddCategory = () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) return;

    api
      .createCategory({
        name: newCategory.name,
        description: newCategory.description,
      })
      .then((data) => {
        setCategories([...categories, data]);
        setNewCategory({ id: "", name: "", description: "" });
        setIsDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Categoria adicionada com sucesso",
        });
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao adicionar categoria",
        })
      );
  };

  const handleEditCategory = (category: CommitmentCategory) => {
    setEditingCategory(category);
    setNewCategory({ ...category });
    setIsDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) return;

    api
      .updateCategory({
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
      })
      .then(() => {
        setCategories(
          categories.map((cat) =>
            cat.id === newCategory.id ? newCategory : cat
          )
        );
        setEditingCategory(null);
        setNewCategory({ id: "", name: "", description: "" });
        setIsDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Categoria atualizada com sucesso",
        });
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao atualizar categoria",
        })
      );
  };

  const handleDeleteCategory = (categoryId: string) => {
    api
      .deleteCategory(categoryId)
      .then(() => {
        setCategories(categories.filter((cat) => cat.id !== categoryId));
        toast({
          title: "Sucesso",
          description: "Categoria removida com sucesso",
        });
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao remover categoria",
        })
      );
  };

  return (
    <>
      <Button
        className="mt-4"
        onClick={() => {
          setNewCategory({ id: "", name: "", description: "" });
          setEditingCategory(null);
          setIsDialogOpen(true);
        }}
      >
        Nova Categoria
      </Button>
      <Card className="mt-4 max-w-4xl">
        <CardContent className="p-6 space-y-4">
          {categories.length > 0 ? (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="p-4 rounded-md border border-border bg-card flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Nome</Label>
            <Input
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              placeholder="Digite o nome da categoria"
            />
            <Label>Descrição</Label>
            <Textarea
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              placeholder="Digite a descrição da categoria"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={
                editingCategory ? handleUpdateCategory : handleAddCategory
              }
            >
              {editingCategory ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
