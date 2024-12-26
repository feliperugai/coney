"use client";

import { Loader2 } from "lucide-react";
import { FormCategorySelect } from "~/components/forms/category-select";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import FormInput, { FormCurrencyInput } from "~/components/ui/input";
import { useGoalForm, type GoalFormValues } from "./useForm";

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { id: string } & GoalFormValues;
}

export default function GoalDialog({
  open,
  onOpenChange,
  initialData,
}: GoalDialogProps) {
  const { form, onSubmit, isLoading } = useGoalForm(
    () => onOpenChange(false),
    initialData,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? "Editar meta" : "Nova meta"}
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={onSubmit} {...form}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <FormInput
                containerClassName="flex-1"
                name="startDate"
                type="date"
                label="Data"
                disabled={isLoading}
                required
              />
              <FormInput
                containerClassName="flex-1"
                name="endDate"
                type="date"
                label="Data"
                disabled={isLoading}
                required
              />
              <FormCurrencyInput
                containerClassName="flex-1"
                name="amount"
                label="Valor"
                placeholder="Ex: 1500.00"
                disabled={isLoading}
                required
              />
            </div>

            <FormCategorySelect
              categoryKey="categoryId"
              subcategoryKey="subcategoryId"
            />
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
