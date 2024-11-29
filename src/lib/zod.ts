import { z } from "zod";

export function currency() {
  return z.union([z.string(), z.number()]).transform((val) => {
    // Converte para número, se for uma string
    const numValue =
      typeof val === "string" ? parseFloat(val.replace(",", ".")) : val;

    // Verifica se é um número válido e positivo
    if (isNaN(numValue) || numValue <= 0) {
      throw new Error("Amount must be a positive number");
    }

    return numValue;
  });
}
