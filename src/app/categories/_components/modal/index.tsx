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
  function closeModal() {
    onOpenChange(false);
  }

  const { form, onSubmit, isLoading } = useCategoryForm(
    closeModal,
    initialData,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={onSubmit} {...form}>
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
