import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { subcategories } from "./subcategories";

export const categories = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
}));

// Tipos inferidos do Drizzle
export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

// Schemas Zod para validação
export const insertCategorySchema = z.object({
  name: z.string().min(1).max(255),
  color: z.string(),
});

export const selectCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});
