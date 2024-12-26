import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { recipients } from "./recipients";
import { subcategories } from "./subcategories";
import { goals } from "./goals";

export const categories = pgTable("category", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }),
  description: varchar("description", { length: 255 }),
  image: varchar("image", { length: 255 }),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  recipients: many(recipients),
  goals: many(goals),
}));

// Tipos inferidos do Drizzle
export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

// Schemas Zod para validação
export const insertCategorySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const selectCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  image: z.string(),
});
