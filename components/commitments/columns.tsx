"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, MoreHorizontal, Pencil, RefreshCcw, Trash2 } from "lucide-react";
import { TasksDialog } from "./tasks-dialog";

interface ColumnsOptions {
  statuses: Status[];
  onEdit: (commitment: Commitment) => void;
  onDelete: (id: string) => void;
  onComplete: (commitment: Commitment) => void;
  onInProgress: (commitment: Commitment) => void;
  onNotification: (commmitment: Commitment) => void;
}

export const columns = ({
  statuses,
  onEdit,
  onDelete,
  onComplete,
  onInProgress,
  onNotification
}: ColumnsOptions): ColumnDef<Commitment>[] => [
  {
    accessorKey: "title",
    header: "Título",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Status;
      return (
        <Badge
          variant={
            status.name === "Em andamento"
              ? "outline"
              : status.name === "Concluido"
              ? "success"
              : "warning"
          }
        >
          {status.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      const category = row.getValue("category") as CommitmentCategory;
      return <Badge variant="outline">{category.name}</Badge>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Data de Vencimento",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate"));
      return format(date, "PPP", { locale: ptBR });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const commitment = row.original;
      const status = commitment.status as Status;
      const isConcluded = status.name === "Concluido";

      return (
        <div className="flex items-center gap-2">
          <TasksDialog commitment={commitment} statuses={statuses} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(commitment)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  isConcluded
                    ? onInProgress(commitment)
                    : onComplete(commitment)
                }
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                {isConcluded ? "Em andamento" : "Concluir"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNotification(commitment)}>
                <Bell className="mr-2 h-4 w-4" />
                Notificacões
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(commitment.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
