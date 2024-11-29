import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const incomes = pgTable(
  "income",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    fixedDay: integer("fixed_day"),
    nthBusinessDay: integer("nth_business_day"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    fixedDayCheck: sql`${table.fixedDay} >= 1 AND ${table.fixedDay} <= 31`,
    nthBusinessDayCheck: sql`${table.nthBusinessDay} >= 1 AND ${table.nthBusinessDay} <= 31`,
  }),
);

// Tipos inferidos do Drizzle
export type Income = InferSelectModel<typeof incomes>;
export type NewIncome = InferInsertModel<typeof incomes>;

// Schema Zod para validação
export const insertIncomeSchema = z.object({
  amount: z
    .number()
    .positive()
    .transform((value) => value.toString()),
  description: z.string().min(1).max(255),
  fixedDay: z.number().min(1).max(31).optional().nullable(),
  isBusinessDay: z.boolean().optional(),
  nthBusinessDay: z.number().min(1).max(31).optional().nullable(),
});

export const selectIncomeSchema = z.object({
  id: z.string(),
  amount: z.number(),
  description: z.string(),
  fixedDay: z.number().nullable(),
  isBusinessDay: z.boolean(),
  nthBusinessDay: z.number().nullable(),
});
