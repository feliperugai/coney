import { type InferInsertModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { categories } from "./categories";
import { subcategories } from "./subcategories";

export const recipients = pgTable("recipient", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  color: varchar("color", { length: 7 }),
  description: text("description"),
  image: text("image"),
  categoryId: uuid("category_id").references(() => categories.id),
  subcategoryId: uuid("subcategory_id").references(() => subcategories.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const recipientRelations = relations(recipients, ({ one }) => ({
  category: one(categories, {
    fields: [recipients.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [recipients.subcategoryId],
    references: [subcategories.id],
  }),
}));

export const recipientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  color: z.string().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  subcategoryId: z.string().uuid().optional().nullable(),
});

export type Recipient = InferInsertModel<typeof recipients>;
export type NewRecipient = InferInsertModel<typeof recipients>;

export const createRecipientSchema = recipientSchema.omit({ id: true });
export const updateRecipientSchema = recipientSchema;
