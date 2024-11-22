"use client";

import { Loader2, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import useDeleteCategory from "~/hooks/data/categories/useDeleteCategory";
import { api } from "~/trpc/react";
import CategoryDialog from "./_components/modal";

export default function CategoriesPage() {
  const [categoryId, setCategoryId] = useQueryState("categoryId");

  const { data, isLoading } = api.category.getAll.useQuery();
  const selectedCategory = data?.find((cat) => cat.id === categoryId);
  const { mutate: deleteCategory, isPending } = useDeleteCategory();

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
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button onClick={() => setCategoryId("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cor</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((category) => (
              <TableRow
                key={category.id}
                className="cursor-pointer"
                onClick={() => setCategoryId(category.id)}
              >
                <TableCell>
                  <div
                    className="h-6 w-6 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCategory({ id: category.id });
                    }}
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Excluir"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
