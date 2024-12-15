import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import {
  categories,
  paymentMethods,
  recipients,
  subcategories,
  users,
} from "../schema";
import { transactions } from "./transactions";

export const installmentPurchases = pgTable("installment_purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  description: text("description"),
  totalInstallments: integer("total_installments").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  categoryId: uuid("category_id").references(() => categories.id),
  subcategoryId: uuid("subcategory_id").references(() => subcategories.id),
  recipientId: uuid("recipient_id").references(() => recipients.id),
  paymentMethodId: uuid("payment_method_id")
    .references(() => paymentMethods.id)
    .notNull(),
  originalAmount: numeric("original_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  installmentAmount: numeric("installment_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const installmentRelations = relations(
  installmentPurchases,
  ({ many, one }) => ({
    transactions: many(transactions),
    user: one(users, {
      fields: [installmentPurchases.userId],
      references: [users.id],
    }),
    category: one(categories, {
      fields: [installmentPurchases.categoryId],
      references: [categories.id],
    }),
    subcategory: one(subcategories, {
      fields: [installmentPurchases.subcategoryId],
      references: [subcategories.id],
    }),
    recipient: one(recipients, {
      fields: [installmentPurchases.recipientId],
      references: [recipients.id],
    }),
    paymentMethod: one(paymentMethods, {
      fields: [installmentPurchases.paymentMethodId],
      references: [paymentMethods.id],
    }),
  }),
);

export type InstallmentPurchase = InferSelectModel<typeof installmentPurchases>;
export type NewInstallmentPurchase = InferInsertModel<
  typeof installmentPurchases
>;

export const insertSchema = z.object({
  totalInstallments: z.number().min(1).max(100),
  date: z.date(),
  description: z.string().min(1).max(255).optional().nullable(),
  amount: z
    .number()
    .positive()
    .transform((value) => value.toString()),
  paymentMethodId: z.string().uuid(),
  categoryId: z.string().uuid().optional().nullable(),
  subcategoryId: z.string().uuid().optional().nullable(),
  recipientId: z.string().uuid().optional().nullable(),
  userId: z.string().uuid(),
});

export type InsertInstallmentPurchase = z.infer<typeof insertSchema>;
