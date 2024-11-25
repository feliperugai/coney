/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreatePaymentMethod } from "~/hooks/data/payment-methods/useCreatePaymentMethod";
import { useUpdatePaymentMethod } from "~/hooks/data/payment-methods/useUpdatePaymentMethod";

const paymentMethodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres" }),
  color: z.string(),
  description: z.string().optional().nullable(),
});

export type PaymentMethodForm = z.infer<typeof paymentMethodSchema>;

export function usePaymentMethodForm(
  closeModal: () => void,
  initialData?: { id: string } & PaymentMethodForm,
) {
  const { createPaymentMethod, isCreating } = useCreatePaymentMethod({
    onSuccess: closeModal,
  });

  const { updatePaymentMethod, isUpdating } = useUpdatePaymentMethod({
    onSuccess: closeModal,
  });

  const isLoading = isCreating || isUpdating;

  function onSubmit(data: PaymentMethodForm) {
    if (initialData) {
      updatePaymentMethod({
        id: initialData.id,
        data,
      });
    } else {
      createPaymentMethod(data);
    }
  }

  const form = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: initialData ?? {
      name: "",
      color: "#000000",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        name: "",
        color: "#000000",
        description: "",
      });
    }
  }, [initialData]);

  return { onSubmit, form, isLoading };
}
