"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const nameSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
});

type NameFormValues = z.infer<typeof nameSchema>;

interface EditNameModalProps {
  currentName: string;
  onNameUpdate: (newName: string) => void;
}

export function EditNameModal({
  currentName,
  onNameUpdate,
}: EditNameModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const { mutate, isPending } = api.user.updateName.useMutation({
    onSuccess: (data) => {
      toast("Nome atualizado");
      onNameUpdate(data?.name ?? "");
      setIsOpen(false);
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  const onSubmit = (values: NameFormValues) => {
    mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Nome</DialogTitle>
        </DialogHeader>
        <Form {...form} onSubmit={onSubmit}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu novo nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" loading={isPending}>
            Salvar
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
