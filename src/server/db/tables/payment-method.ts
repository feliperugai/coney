import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const paymentMethods = pgTable("payment_method", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  description: varchar("account_id", { length: 255 }),
});

export type PaymentMethod = InferSelectModel<typeof paymentMethods>;
export type NewPaymentMethod = InferInsertModel<typeof paymentMethods>;

export const insertPaymentMethodSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  color: z.string(),
});

export const updatePaymentMethodSchema = z.object({
  id: z.string(),
  data: insertPaymentMethodSchema.partial(),
});

export const selectPaymentMethodSchema = z.object({
  id: z.string(),
});
