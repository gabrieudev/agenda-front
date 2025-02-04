"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ListTodo, Pencil, Plus, Trash2, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "T tulo   obrigat rio"),
  description: z.string().min(1, "Descri o   obrigat ria"),
});

interface TasksDialogProps {
  commitment: Commitment;
  statuses: Status[];
}

export function TasksDialog({ commitment, statuses }: TasksDialogProps) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isConcluded = selectedTask?.status.name === "Concluido";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const loadTasks = async () => {
    try {
      const data = await api.getTasks(commitment.id);
      setTasks(data);
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar tarefas",
      });
    }
  };

  useEffect(() => {
    if (selectedTask) {
      form.reset({
        title: selectedTask.title,
        description: selectedTask.description,
      });
    } else {
      form.reset();
    }
  }, [selectedTask, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (selectedTask) {
        await api.updateTask(commitment.id, {
          ...values,
          commitment: commitment,
        });
      } else {
        await api.createTask(commitment.id, {
          ...values,
          commitment: commitment,
        });
      }
      await loadTasks();
      setIsFormOpen(false);
      setSelectedTask(undefined);
      form.reset();
      toast({
        title: "Sucesso",
        description: `Tarefa ${
          selectedTask ? "atualizada" : "criada"
        } com sucesso`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao ${selectedTask ? "atualizar" : "criar"} tarefa`,
      });
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await api.deleteTask(commitment.id, taskId);
      await loadTasks();
      toast({
        title: "Sucesso",
        description: "Tarefa deletada com sucesso",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao deletar tarefa",
      });
    }
  };

  const handleInProgress = async (task: Task) => {
    const inProgressStatus = statuses.find(
      (status) => status.name === "Em andamento"
    );
    if (!inProgressStatus) return;

    task.status = inProgressStatus;
    await api.updateTask(commitment.id, task);
    await loadTasks();
  };

  const handleComplete = async (task: Task) => {
    const completedStatus = statuses.find(
      (status) => status.name === "Concluido"
    );
    if (!completedStatus) return;

    task.status = completedStatus;
    await api.updateTask(commitment.id, task);
    await loadTasks();
  };

  return (
    <Dialog onOpenChange={(open) => open && loadTasks()}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <ListTodo className="h-4 w-4" />
          <span className="sr-only">Ver tarefas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Tarefas - {commitment.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setSelectedTask(undefined);
                setIsFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhuma tarefa encontrada
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.status.name === "Em andamento"
                            ? "outline"
                            : "success"
                        }
                      >
                        {task.status.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTask(task);
                            isConcluded
                              ? handleInProgress(task)
                              : handleComplete(task);
                          }}
                        >
                          <RefreshCcw className="h-4 w-4" />
                          <span className="sr-only">
                            {isConcluded ? "Em andamento" : "Concluido"}
                          </span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTask(task);
                            setIsFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar tarefa</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Deletar tarefa</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedTask ? "Editar Tarefa" : "Nova Tarefa"}
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>T tulo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {selectedTask ? "Atualizar" : "Criar"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}
