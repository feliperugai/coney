"use client";

import { Loader2, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import SubcategoryDialog from "./_components/modal";

export default function SubcategoriesPage() {
  const [subcategoryId, setCategoryId] = useQueryState("subcategoryId");
  const { data, isLoading } = api.subcategory.getAll.useQuery();
  const selected = data?.find((cat) => cat.id === subcategoryId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sub categorias</h1>
        <Button onClick={() => setCategoryId("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Subcategoria
        </Button>
      </div>

      <DataTable
        onClick={async (category) => void (await setCategoryId(category.id))}
        columns={columns}
        data={data}
        enableRowSelection
      />

      {subcategoryId && (
        <SubcategoryDialog
          initialData={subcategoryId === "new" ? undefined : selected}
          open={subcategoryId !== null}
          onOpenChange={async (open) => {
            if (!open) await setCategoryId(null);
          }}
        />
      )}
    </div>
  );
}
