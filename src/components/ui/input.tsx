import * as React from "react";

import { useReducer } from "react";
import { useFormContext } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { cn } from "~/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import RequiredInput from "./required-input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "focus-visible:ring-biotronik flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

interface FieldInputProps {
  label?: string;
  placeholder?: string;
  description?: string;
  name: string;
  disabled?: boolean;
  type?: string;
  className?: string;
  containerClassName?: string;
  required?: boolean;
  autoFocus?: boolean;
  readonly?: boolean;
}

export default function FormInput({
  label,
  placeholder,
  description,
  disabled = false,
  name,
  type,
  className,
  containerClassName,
  required,
  autoFocus,
  readonly = false,
}: FieldInputProps) {
  const form = useFormContext();

  return (
    <div className={cn("mb-3 space-y-2", containerClassName)}>
      <FormField
        control={form.control}
        name={name}
        disabled={disabled}
        render={({ field: f, fieldState: { error } }) => {
          return (
            <FormItem>
              {label && (
                <FormLabel>
                  {label} {required && !readonly && <RequiredInput />}
                </FormLabel>
              )}
              {readonly ? (
                <div>{f.value || "-"}</div>
              ) : (
                <FormControl>
                  <Input
                    type={type}
                    placeholder={placeholder || ""}
                    {...f}
                    className={cn(
                      error?.message &&
                        "border-destructive focus:border-none focus:ring-destructive focus-visible:ring-destructive",
                      className,
                    )}
                    value={f.value?.toString() || ""}
                    autoFocus={autoFocus}
                  />
                </FormControl>
              )}
              {description && <FormDescription>{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}

interface FormMaskInputProps extends FieldInputProps {
  mask: "cnpj" | "phone" | "postalCode";
}

const masks = {
  cnpj: "99.999.999/9999-99",
  phone: "(99) 99999-9999",
  currency: "currency",
  postalCode: "99999-999",
};

export function FormMaskInput({
  label,
  placeholder,
  description,
  disabled = false,
  mask,
  name,
  className,
  containerClassName,
}: FormMaskInputProps) {
  const form = useFormContext();
  const registerWithMask = useHookFormMask(form.register);

  return (
    <div className={cn("mb-3 space-y-2", containerClassName)}>
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            placeholder={placeholder || ""}
            {...registerWithMask(name, masks[mask], {
              required: true,
            })}
            className={className}
            disabled={disabled}
          />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    </div>
  );
}

type CurrencyInputProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder: string;
  locale?: Intl.LocalesArgument;
  currency?: "BRL" | "USD" | "EUR";
};

function CurrencyInput({
  name,
  label,
  placeholder,
  disabled,
  locale = "pt-br",
  currency = "BRL",
}: CurrencyInputProps) {
  const moneyFormatter = new Intl.NumberFormat(locale, {
    currency,
    currencyDisplay: "symbol",
    currencySign: "standard",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const form = useFormContext();

  const initialValue = form.getValues(name)
    ? moneyFormatter.format(form.getValues(name))
    : "";

  const [value, setValue] = useReducer((_: any, next: string) => {
    const digits = next.replace(/\D/g, "");
    return moneyFormatter.format(Number(digits) / 100);
  }, initialValue);

  function handleChange(realChangeFn: Function, formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, "");
    const realValue = Number(digits) / 100;
    realChangeFn(realValue);
  }

  return (
    <FormField
      control={form.control}
      disabled={disabled}
      name={name}
      render={({ field, fieldState: { error } }) => {
        field.value = value;
        const _change = field.onChange;

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                placeholder={placeholder}
                type="text"
                {...field}
                onChange={(ev) => {
                  setValue(ev.target.value);
                  handleChange(_change, ev.target.value);
                }}
                className={cn(
                  error?.message &&
                    "border-destructive focus:border-none focus:ring-destructive focus-visible:ring-destructive",
                )}
                value={value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export { CurrencyInput, Input };
