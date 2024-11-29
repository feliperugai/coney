"use client";

import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import FormInput, { FormCurrencyInput } from "~/components/ui/input";
import { useIncomeForm, type IncomeForm } from "./useForm";

interface IncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { id: string } & IncomeForm;
}

export default function IncomeDialog({
  open,
  onOpenChange,
  initialData,
}: IncomeDialogProps) {
  const { form, onSubmit, isLoading } = useIncomeForm(
    () => onOpenChange(false),
    initialData,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? "Editar Renda" : "Nova Renda"}
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={onSubmit} {...form}>
          <div className="flex flex-col gap-6">
            <FormCurrencyInput
              name="amount"
              label="Valor"
              placeholder="Ex: 1500.00"
              disabled={isLoading}
              required
            />

            <FormInput
              name="description"
              label="Descrição"
              placeholder="Ex: Salário"
              disabled={isLoading}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="fixedDay"
                label="Dia Fixo"
                type="number"
                placeholder="Ex: 15"
                disabled={isLoading}
              />

              <FormInput
                name="nthBusinessDay"
                label="Dia Útil (Nº)"
                type="number"
                placeholder="Ex: 3"
                disabled={isLoading}
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
