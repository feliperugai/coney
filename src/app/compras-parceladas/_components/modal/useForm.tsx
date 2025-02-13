/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateInstallmentPurchase } from "~/hooks/data/intstallments/useCreateInstallment";
import { useUpdateInstallmentPurchase } from "~/hooks/data/intstallments/useUpdateInstallment";
import { currency } from "~/lib/zod";
import { api } from "~/trpc/react";

const scheam = z.object({
  date: z.coerce.date(),
  description: z.string().min(1).max(255).optional().nullable(),
  amount: currency(),
  paymentMethodId: z.string().uuid(),
  totalInstallments: z.coerce.number().min(1).max(100),
  categoryId: z.string().uuid().optional().nullable(),
  subcategoryId: z.string().uuid().optional().nullable(),
  recipientId: z.string().uuid().optional().nullable(),
  newRecipient: z.string().optional().nullable(),
  userId: z.string().uuid(),
});

export type InstallmentPurchaseFormValues = z.infer<typeof scheam>;

function getDate(date?: string | Date): any {
  date = date ?? new Date();
  return new Date(date).toISOString().split("T")[0];
}

export function useInstallmentPurchaseForm(
  closeModal: () => void,
  initialData?: { id: string } & InstallmentPurchaseFormValues,
) {
  const session = useSession();
  const { createInstallmentPurchase, isCreating } =
    useCreateInstallmentPurchase({
      onSuccess: closeModal,
    });

  const { updateInstallmentPurchase, isUpdating } =
    useUpdateInstallmentPurchase({
      onSuccess: closeModal,
    });

  const { mutateAsync } = api.recipient.create.useMutation();

  const isLoading = isCreating || isUpdating;

  async function createRecipient(data: InstallmentPurchaseFormValues) {
    try {
      const recipient = await mutateAsync({
        name: data.newRecipient!,
        categoryId: data.categoryId!,
        subcategoryId: data.subcategoryId!,
      });

      if (!recipient) {
        console.error("Could not create installment purchase");
        return;
      }

      return recipient.id;
    } catch (error) {
      console.error(error);
    }
  }

  async function onSubmit(data: InstallmentPurchaseFormValues) {
    if (data.newRecipient) {
      data.recipientId = await createRecipient(data);
    }

    if (initialData) {
      updateInstallmentPurchase({ id: initialData.id, data });
    } else {
      createInstallmentPurchase(data);
    }
  }

  const form = useForm<InstallmentPurchaseFormValues>({
    resolver: zodResolver(scheam),
    defaultValues: initialData ?? {
      date: getDate(),
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        date: getDate(initialData.date),
      });
    } else {
      form.reset({
        date: getDate(),
        userId: session?.data?.user?.id,
      });
    }
  }, [initialData]);

  return { onSubmit, form, isLoading };
}
