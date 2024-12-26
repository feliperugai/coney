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
import { FormImage } from "~/components/ui/form-image";
import FormInput from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
            {initialData ? "Editar subcategoria" : "Nova Subcategoria"}
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={onSubmit} {...form}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="mb-[5px] space-y-2">
                <Label className="">Imagem</Label>
                <FormImage name="image" queryKey="name" disabled={isLoading} />
              </div>
              <FormInput
                containerClassName="flex-1"
                name="name"
                label="Nome"
                placeholder="Ex: Feira"
                disabled={isLoading}
                required
              />

              <FormColorPicker
                name="color"
                label="Cor"
                disabled={isLoading}
                enabledTabs={{ solid: true }}
              />
            </div>

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
              type="textarea"
              name="description"
              label="Descrição"
              placeholder="Ex: Compra de peixes, frutas e verduras"
              disabled={isLoading}
            />
          </div>

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
