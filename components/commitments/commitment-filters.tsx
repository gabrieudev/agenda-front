"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommitmentFiltersProps {
  statuses: Status[];
  categories: CommitmentCategory[];
  selectedStatusId?: string;
  selectedCategoryId?: string;
  onStatusChange: (value: string | undefined) => void;
  onCategoryChange: (value: string | undefined) => void;
}

export function CommitmentFilters({
  statuses,
  categories,
  selectedStatusId,
  selectedCategoryId,
  onStatusChange,
  onCategoryChange,
}: CommitmentFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={selectedStatusId ?? "todos"}
          onValueChange={(value) =>
            onStatusChange(value === "todos" ? undefined : value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Categoria</label>
        <Select
          value={selectedCategoryId ?? "todas"}
          onValueChange={(value) =>
            onCategoryChange(value === "todas" ? undefined : value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

