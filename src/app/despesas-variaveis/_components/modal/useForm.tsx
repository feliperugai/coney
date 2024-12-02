/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateTransaction } from "~/hooks/data/transactions/useCreateTransaction";
import { useUpdateTransaction } from "~/hooks/data/transactions/useUpdateTransaction";
import { currency } from "~/lib/zod";

const transactionFormSchema = z.object({
  date: z.coerce.date(),
  description: z.string().min(1).max(255),
  amount: currency(),
  categoryId: z.string().uuid().optional().nullable(),
  subcategoryId: z.string().uuid().optional().nullable(),
  recipientId: z.string().uuid().optional().nullable(),
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
  const { createTransaction, isCreating } = useCreateTransaction({
    onSuccess: closeModal,
  });

  const { updateTransaction, isUpdating } = useUpdateTransaction({
    onSuccess: closeModal,
  });

  const isLoading = isCreating || isUpdating;

  function onSubmit(data: TransactionFormValues) {
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
      });
    }
  }, [initialData]);

  return { onSubmit, form, isLoading };
}