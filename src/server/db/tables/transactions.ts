import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { installments, paymentMethods } from "../schema";
import { categories } from "./categories";
import { recipients } from "./recipients";
import { subcategories } from "./subcategories";

export const transactions = pgTable("transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").notNull(),
  paymentMethodId: uuid("payment_method_id").references(
    () => paymentMethods.id,
  ),
  description: varchar("description", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  installmentId: uuid("installment_id").references(() => installments.id),
  installmentNumber: integer("installment"),
  categoryId: uuid("category_id").references(() => categories.id),
  subcategoryId: uuid("subcategory_id").references(() => subcategories.id),
  recipientId: uuid("recipient_id").references(() => recipients.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const transactionRelations = relations(transactions, ({ one }) => ({
  installment: one(installments, {
    fields: [transactions.installmentId],
    references: [installments.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [transactions.subcategoryId],
    references: [subcategories.id],
  }),
  recipient: one(recipients, {
    fields: [transactions.recipientId],
    references: [recipients.id],
  }),
  paymentMethod: one(paymentMethods, {
    fields: [transactions.paymentMethodId],
    references: [paymentMethods.id],
  }),
}));

export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;

export const insertTransactionSchema = z.object({
  date: z.date(),
  description: z.string().min(1).max(255),
  paymentMethodId: z.string().uuid().optional().nullable(),
  amount: z
    .number()
    .positive()
    .transform((value) => value.toString()),
  installmentCount: z.number().min(1).max(100).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  subcategoryId: z.string().uuid().optional().nullable(),
  recipientId: z.string().uuid().optional().nullable(),
});
