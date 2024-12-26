/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateRecipient } from "~/hooks/data/recipients/useCreateRecipient";
import { useUpdateRecipient } from "~/hooks/data/recipients/useUpdateRecipient";

const recipientFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres" }),
  color: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  subcategoryId: z.string().uuid().optional().nullable(),
  image: z.string().optional().nullable(),
});

export type RecipientFormValues = z.infer<typeof recipientFormSchema>;

export function useRecipientForm(
  closeModal: () => void,
  initialData?: { id: string } & RecipientFormValues,
) {
  const { createRecipient, isCreating } = useCreateRecipient({
    onSuccess: closeModal,
  });

  const { updateRecipient, isUpdating } = useUpdateRecipient({
    onSuccess: closeModal,
  });

  const isLoading = isCreating || isUpdating;

  function onSubmit(data: RecipientFormValues) {
    if (initialData) {
      updateRecipient({
        id: initialData.id,
        ...data,
      });
    } else {
      createRecipient(data);
    }
  }

  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientFormSchema),
    defaultValues: initialData ?? {
      name: "",
      color: "#000000",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        name: "",
        color: "#000000",
      });
    }
  }, [initialData]);

  return { onSubmit, form, isLoading };
}
