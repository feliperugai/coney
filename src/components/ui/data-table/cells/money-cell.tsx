import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "~/lib/utils";

interface MoneyCellProps {
  value: number | string;
  variant: "income" | "expense" | "default";
  className?: string;
}

const moneyVariants = cva("text-muted-foreground font-semibold ", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      income: "text-success",
      expense: "text-muted",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

export type CurrencyVariant = VariantProps<typeof moneyVariants>["variant"];

export default function CurrencyCell({
  value,
  variant = "default",
  className,
}: MoneyCellProps) {
  const moneyFormatter = new Intl.NumberFormat("pt-br", {
    currency: "BRL",
    currencyDisplay: "symbol",
    currencySign: "standard",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className={cn(moneyVariants({ variant }), className)}>
      {moneyFormatter.format(parseFloat(value.toString()))}
    </div>
  );
}
