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
import { useCategoryForm, type CategoryFormValues } from "./useForm";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { id: string } & CategoryFormValues;
}

export default function CategoryDialog({
  open,
  onOpenChange,
  initialData,
}: CategoryDialogProps) {
  const { form, onSubmit, isLoading } = useCategoryForm(
    () => onOpenChange(false),
    initialData,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={onSubmit} {...form}>
          <div className="flex flex-col gap-6">
            <div className="flex-1 space-y-6">
              <div className="flex gap-10">
                <div className="space-y-2">
                  <Label className="">Imagem</Label>
                  <FormImage
                    name="image"
                    disabled={isLoading}
                    queryKey="name"
                  />
                </div>
                <FormInput
                  containerClassName="flex-1"
                  name="name"
                  label="Nome"
                  placeholder="Ex: Feira"
                  disabled={isLoading}
                  required
                />
              </div>

              <FormInput
                name="description"
                label="Descrição"
                placeholder="Ex: Compra de peixes, frutas e verduras"
                disabled={isLoading}
              />

              <FormColorPicker
                name="color"
                label="Cor"
                disabled={isLoading}
                enabledTabs={{ solid: true }}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
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
