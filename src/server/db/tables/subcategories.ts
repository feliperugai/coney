import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { categories, type Category } from "./categories";
import { goals } from "./goals";

export const subcategories = pgTable("subcategory", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }),
  description: varchar("description", { length: 255 }),
  image: varchar("image", { length: 255 }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
});

export const subcategoriesRelations = relations(
  subcategories,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [subcategories.categoryId],
      references: [categories.id],
    }),
    goals: many(goals),
  }),
);

// Tipos inferidos do Drizzle
export type Subcategory = InferSelectModel<typeof subcategories> & {
  category: Category;
};
export type NewSubcategory = InferInsertModel<typeof subcategories>;

// Schemas Zod para validação
export const insertSubcategorySchema = z.object({
  name: z.string().min(1).max(255),
  categoryId: z.string(),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const updateSubcategorySchema = z.object({
  id: z.string(),
  data: insertSubcategorySchema.partial(),
});

export const selectSubcategorySchema = z.object({
  id: z.string(),
});
