"use client";

import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import CategoryDialog from "./_components/modal";

export default function CategoriesPage() {
  const [categoryId, setCategoryId] = useQueryState("categoryId");
  const { data, isLoading } = api.category.getAll.useQuery();
  const selectedCategory = data?.find((cat) => cat.id === categoryId);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button onClick={() => setCategoryId("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        onClick={async (category) => void (await setCategoryId(category.id))}
        columns={columns}
        data={data}
        enableRowSelection
      />

      {categoryId && (
        <CategoryDialog
          open={categoryId !== null}
          onOpenChange={async (open) => {
            if (!open) await setCategoryId(null);
          }}
          initialData={categoryId === "new" ? undefined : selectedCategory}
        />
      )}
    </div>
  );
}
