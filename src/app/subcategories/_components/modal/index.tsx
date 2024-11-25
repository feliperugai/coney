/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { FormColorPicker } from "~/components/ui/color-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import FormInput from "~/components/ui/input";
import { FormSelect } from "~/components/ui/select";
import { api } from "~/trpc/react";
import { useSubcategoryForm, type SubcategoryForm } from "./useForm";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { id: string } & SubcategoryForm;
}

export default function SubcategoryDialog({
  open,
  onOpenChange,
  initialData,
}: CategoryDialogProps) {
  const { data: categories, isLoading: loadingCategories } =
    api.category.getAll.useQuery();

  const { form, onSubmit, isLoading } = useSubcategoryForm(
    closeModal,
    initialData,
  );

  function closeModal() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="Nova subcategoria">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={onSubmit} {...form}>
          <FormSelect
            name="categoryId"
            label="Categoria"
            loading={loadingCategories}
            items={
              categories?.map((category) => ({
                value: category.id,
                label: category.name,
              })) ?? []
            }
            disabled={isLoading}
            required
          />

          <FormInput
            name="name"
            label="Nome"
            placeholder="Digite o nome da categoria"
            disabled={isLoading}
            required
          />

          <FormColorPicker
            name="color"
            label="Cor"
            disabled={isLoading}
            enabledTabs={{ solid: true }}
            required
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
