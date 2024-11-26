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
import { FormDropzone } from "~/components/uploadthing";
import { usePaymentMethodForm, type PaymentMethodForm } from "./useForm";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { id: string } & PaymentMethodForm;
}

export default function PaymentMethodDialog({
  open,
  onOpenChange,
  initialData,
}: PaymentMethodDialogProps) {
  const { form, onSubmit, isLoading } = usePaymentMethodForm(
    closeModal,
    initialData,
  );

  function closeModal() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby="Novo método de pagamento"
        className="max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? "Editar Método de Pagamento"
              : "Novo Método de Pagamento"}
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={onSubmit} {...form}>
          <div className="flex justify-stretch gap-2">
            <div className="flex-1 space-y-6">
              <FormInput
                name="name"
                label="Nome"
                placeholder="Digite o nome do método de pagamento"
                disabled={isLoading}
                required
              />

              <FormInput
                name="description"
                label="Descrição"
                placeholder="Digite a descrição do método de pagamento"
                disabled={isLoading}
              />

              <FormColorPicker
                name="color"
                label="Cor"
                disabled={isLoading}
                enabledTabs={{ solid: true }}
                required
              />
            </div>
            <FormDropzone name="image" />
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
