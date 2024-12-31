/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTransaction } from "~/hooks/data/transactions/useCreateTransaction";
import { useUpdateTransaction } from "~/hooks/data/transactions/useUpdateTransaction";
import { currency } from "~/lib/zod";
import { api } from "~/trpc/react";

const transactionFormSchema = z.object({
  date: z.coerce.date(),
  description: z.string().min(1).max(255),
  amount: currency(),
  paymentMethodId: z.string().uuid().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  subcategoryId: z.string().uuid().optional().nullable(),
  recipientId: z.string().uuid().optional().nullable(),
  newRecipient: z.string().optional().nullable(),
  userId: z.string().uuid().optional().nullable(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

function getDate(date?: string | Date): any {
  date = date ?? new Date();
  return new Date(date).toISOString().split("T")[0];
}

export function useTransactionForm(
  closeModal: () => void,
  initialData?: { id: string } & TransactionFormValues,
) {
  const session = useSession();
  const { createTransaction, isCreating } = useCreateTransaction({
    onSuccess: closeModal,
  });

  const { updateTransaction, isUpdating } = useUpdateTransaction({
    onSuccess: closeModal,
  });

  const { mutateAsync } = api.recipient.create.useMutation();

  const isLoading = isCreating || isUpdating;

  async function createRecipient(data: TransactionFormValues) {
    try {
      const recipient = await mutateAsync({
        name: data.newRecipient!,
        categoryId: data.categoryId!,
        subcategoryId: data.subcategoryId!,
      });

      if (!recipient) {
        console.error("Could not create recipient!");
        return;
      }

      return recipient.id;
    } catch (error) {
      console.error(error);
    }
  }

  async function onSubmit(data: TransactionFormValues) {
    if (data.newRecipient) {
      data.recipientId = await createRecipient(data);
    }

    if (initialData) {
      updateTransaction({ id: initialData.id, data });
    } else {
      createTransaction(data);
    }
  }

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: initialData ?? {
      date: getDate(),
      userId: session?.data?.user?.id,
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
