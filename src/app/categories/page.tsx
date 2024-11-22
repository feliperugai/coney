"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import FormInput from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres" }),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, { message: "Cor inválida" }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { id: string } & CategoryFormValues;
}

function CategoryDialog({
  open,
  onOpenChange,
  initialData,
}: CategoryDialogProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData ?? {
      name: "",
      color: "#000000",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        name: "",
        color: "#000000",
      });
    }
  }, [initialData]);

  const { mutate: createCategory, isPending: isCreating } =
    api.category.create.useMutation({
      onSuccess: async () => {
        await utils.category.getAll.invalidate();
        onOpenChange(false);
        // form.reset();
        toast({
          title: "Categoria criada",
          description: "A categoria foi criada com sucesso.",
        });
      },
    });

  const { mutate: updateCategory, isPending: isUpdating } =
    api.category.update.useMutation({
      onSuccess: async () => {
        await utils.category.getAll.invalidate();
        onOpenChange(false);
        toast({
          title: "Categoria atualizada",
          description: "A categoria foi atualizada com sucesso.",
        });
      },
    });

  const isLoading = isCreating || isUpdating;

  function onSubmit(data: CategoryFormValues) {
    if (initialData) {
      updateCategory({
        id: initialData.id,
        data,
      });
    } else {
      createCategory(data);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="name"
              label="Nome"
              placeholder="Digite o nome da categoria"
              required
              disabled={isLoading}
            />

            <FormInput
              name="color"
              label="Cor"
              type="color"
              required
              disabled={isLoading}
              className="h-12"
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {initialData ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function CategoriesPage() {
  const { toast } = useToast();
  const [categoryId, setCategoryId] = useQueryState("categoryId");

  const { data: categories, isLoading: isLoadingCategories } =
    api.category.getAll.useQuery();

  const selectedCategory = categories?.find((cat) => cat.id === categoryId);

  const utils = api.useUtils();
  const { mutate: deleteCategory, isPending: isDeleting } =
    api.category.delete.useMutation({
      onSuccess: () => {
        void utils.category.getAll.invalidate();
        toast({
          title: "Categoria excluída",
          description: "A categoria foi excluída com sucesso.",
        });
      },
    });

  if (isLoadingCategories) {
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
            {categories?.map((category) => (
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
                    {isDeleting ? (
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
          onOpenChange={(open) => {
            if (!open) setCategoryId(null);
          }}
          initialData={categoryId === "new" ? undefined : selectedCategory}
        />
      )}
    </div>
  );
}
