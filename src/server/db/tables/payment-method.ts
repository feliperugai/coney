import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const paymentMethods = pgTable("payment_method", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }),
  description: varchar("description", { length: 255 }),
  image: varchar("image", { length: 255 }),
});

export type PaymentMethod = InferSelectModel<typeof paymentMethods>;
export type NewPaymentMethod = InferInsertModel<typeof paymentMethods>;

export const insertPaymentMethodSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const updatePaymentMethodSchema = z.object({
  id: z.string(),
  data: insertPaymentMethodSchema.partial(),
});

export const selectPaymentMethodSchema = z.object({
  id: z.string(),
});
