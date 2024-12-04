"use client";

import { Check } from "lucide-react";
import * as React from "react";

import { CaretSortIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Spinner } from "./spinner";

export type ComboboxOption = {
  value: string;
  label: string;
  image?: string | null;
};

export interface ComboboxProps {
  items?: ComboboxOption[];
  label: string;
  triggerPlaceholder?: string;
  searchPlaceholder?: string;
  description?: string;
  containerClassname?: string;
  className?: string;
  name: string;
  disabled?: boolean;
  required?: boolean;
  isLoading?: boolean;
  append?: React.ReactNode;
}
/**
 *A combobox component that allows the user to select an option from a list of options.
 *
 *@param items - The initial options to display in the combobox
 *@param label - The label for the combobox
 *@param triggerPlaceholder - The placeholder text to display in the combobox trigger
 *@param searchPlaceholder - The placeholder text to display in the combobox search input
 *@param description - An optional description to display below the combobox
 *@param containerClassname - An optional classname to apply to the container
 *@param name - The name of the form field to use for the combobox
 *@param disabled - Whether the combobox is disabled
 *@param required - Whether the combobox is required
 *@param isLoading - Whether the combobox is loading
 *@param append - An optional element to append to the combobox
 */
export function FormAutoComplete({
  label,
  name,
  triggerPlaceholder,
  searchPlaceholder,
  disabled,
  items: initialOptions = [],
  append,
  containerClassname,
  className,
  isLoading,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const form = useFormContext();

  const triggerText = triggerPlaceholder ?? "Selecione uma opção";
  const searchText = searchPlaceholder ?? "Buscar";

  const loading = isLoading;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const option = initialOptions.find(
          (option) => option.value === field.value,
        );
        const displayText = field.value ? option?.label : triggerText;

        console.log(field.value);
        return (
          <FormItem className={cn("flex flex-col space-y-3 pt-1.5", className)}>
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <FormControl>
                <div
                  className={cn(
                    "flex",
                    append && "flex items-center gap-3",
                    containerClassname,
                  )}
                >
                  <PopoverTrigger asChild>
                    <Button
                      name={name}
                      disabled={disabled ?? loading}
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full flex-1 justify-between [&>span]:line-clamp-1",
                        !field.value && "text-muted-foreground",
                        error?.message &&
                          "border-destructive focus:border-none focus:ring-destructive",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {option?.image && (
                          <Image
                            className="h-6 w-6 rounded-full"
                            src={option.image}
                            alt={option.label}
                            height={24}
                            width={24}
                          />
                        )}
                        <span> {displayText}</span>
                      </div>
                      {loading ? (
                        <Spinner className="h-6 w-6 fill-cyan-500" />
                      ) : (
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  {append}
                </div>
              </FormControl>
              <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                <Command className="w-full">
                  <CommandInput
                    loading={loading}
                    placeholder={searchText}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                    <CommandGroup>
                      {initialOptions.map((item) => (
                        <CommandItem
                          key={item.value}
                          value={item.label}
                          onSelect={(currentValue) => {
                            field.onChange(item.value);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === item.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {item.image && (
                            <Image
                              className="h-6 w-6 rounded-full"
                              src={item.image}
                              alt={item.label}
                              height={24}
                              width={24}
                            />
                          )}
                          {item.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
