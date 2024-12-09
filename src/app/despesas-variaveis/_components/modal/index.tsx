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

import PaymentMethodSelect from "~/components/forms/payment-method-select";
import RecipientSelect from "~/components/forms/recipient-select";
import FormInput, { FormCurrencyInput } from "~/components/ui/input";
import { useTransactionForm, type TransactionFormValues } from "./useForm";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { id: string } & TransactionFormValues;
}

export default function TransactionDialog({
  open,
  onOpenChange,
  initialData,
}: TransactionDialogProps) {
  const { form, onSubmit, isLoading } = useTransactionForm(
    () => onOpenChange(false),
    initialData,
  );
  console.log(form.formState.errors);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {initialData ? "Editar despesa variável" : "Nova despesa variável"}
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={onSubmit} {...form}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <FormInput
                containerClassName="flex-1"
                name="date"
                type="date"
                label="Data"
                placeholder="Digite a descrição"
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

            <div className="flex items-center gap-4">
              <RecipientSelect
                name="recipientId"
                className="flex-1"
                disabled={isLoading}
              />
              <PaymentMethodSelect
                className="flex-1"
                name="paymentMethodId"
                disabled={isLoading}
              />
            </div>

            <FormInput
              containerClassName="flex-1"
              name="description"
              label="Descrição"
              placeholder="Digite a descrição"
              disabled={isLoading}
              required
            />

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
