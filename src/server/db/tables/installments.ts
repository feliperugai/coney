import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { transactions } from "./transactions";

export const installments = pgTable("installment", {
  id: uuid("id").primaryKey().defaultRandom(),
  totalInstallments: integer("total_installments").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  originalAmount: numeric("original_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  installmentAmount: numeric("installment_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const installmentRelations = relations(installments, ({ many }) => ({
  transactions: many(transactions),
}));
