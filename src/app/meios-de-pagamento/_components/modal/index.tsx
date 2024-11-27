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
      <DialogContent aria-describedby="Novo método de pagamento">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? "Editar Método de Pagamento"
              : "Novo Método de Pagamento"}
          </DialogTitle>
        </DialogHeader>
        <Form onSubmit={onSubmit} {...form}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="mb-[5px] space-y-2">
                <Label>Imagem</Label>
                <FormImage name="image" disabled={isLoading} queryKey="name" />
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
