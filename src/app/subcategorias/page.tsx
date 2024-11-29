"use client";

import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import useDeleteSubcategory from "~/hooks/data/subcategories/useDeleteSubcategory";
import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import SubcategoryDialog from "./_components/modal";

export default function SubcategoriesPage() {
  const [subcategoryId, setCategoryId] = useQueryState("subcategoryId");
  const { data, isLoading } = api.subcategory.getAll.useQuery();
  const { mutate } = useDeleteSubcategory();
  const selected = data?.find((cat) => cat.id === subcategoryId);

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
        loading={isLoading}
        onDelete={(rows) => {
          mutate({ ids: rows.map((row) => row.id) });
        }}
        onClick={async (category) => void (await setCategoryId(category.id))}
        columns={columns as any}
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
