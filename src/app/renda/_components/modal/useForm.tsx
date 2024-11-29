/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateIncome } from "~/hooks/data/incomes/useCreateIncome";
import { useUpdateIncome } from "~/hooks/data/incomes/useUpdateIncome";
import { currency } from "~/lib/zod";

const insertIncomeSchema = z.object({
  amount: currency(),
  description: z.string().min(1).max(255),
  fixedDay: z.number({ coerce: true }).max(31).optional().nullable(),
  nthBusinessDay: z.number({ coerce: true }).max(31).optional().nullable(),
});
export type IncomeForm = z.infer<typeof insertIncomeSchema>;

const RESET_OBJECT = {
  description: "",
  amount: 0,
  fixedDay: null,
  isBusinessDay: false,
  nthBusinessDay: null,
};

export function useIncomeForm(
  closeModal: () => void,
  initialData?: { id: string } & IncomeForm,
) {
  const { createIncome, isCreating } = useCreateIncome({
    onSuccess: closeModal,
  });

  const { updateIncome, isUpdating } = useUpdateIncome({
    onSuccess: closeModal,
  });

  const isLoading = isCreating || isUpdating;

  function onSubmit(data: IncomeForm) {
    if (initialData) {
      updateIncome({
        id: initialData.id,
        data,
      });
    } else {
      createIncome(data);
    }
  }

  const form = useForm<IncomeForm>({
    resolver: zodResolver(insertIncomeSchema),
    defaultValues: initialData ?? RESET_OBJECT,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset(RESET_OBJECT);
    }
  }, [initialData]);

  return { onSubmit, form, isLoading };
}
