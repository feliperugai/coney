import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { categories, type Category } from "./categories";

export const subcategories = pgTable("subcategory", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  categoryId: varchar("category_id", { length: 255 })
    .notNull()
    .references(() => categories.id),
});

export const subcategoriesRelations = relations(subcategories, ({ one }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
}));

// Tipos inferidos do Drizzle
export type Subcategory = InferSelectModel<typeof subcategories> & {
  category: Category;
};
export type NewSubcategory = InferInsertModel<typeof subcategories>;

// Schemas Zod para validação
export const insertSubcategorySchema = z.object({
  name: z.string().min(1).max(255),
  color: z.string(),
  categoryId: z.string(),
});

export const updateSubcategorySchema = z.object({
  id: z.string(),
  data: insertSubcategorySchema.partial(),
});

export const selectSubcategorySchema = z.object({
  id: z.string(),
});
