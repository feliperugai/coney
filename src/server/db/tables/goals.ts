// ~/server/db/schema/goals.ts
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
  sql,
} from "drizzle-orm";
import {
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { categories, subcategories, users } from "../schema";

export type Goal = InferSelectModel<typeof goals>;
export type NewGoal = InferInsertModel<typeof goals>;

export const goals = pgTable("goal", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  categoryId: uuid("category_id").references(() => categories.id),
  subcategoryId: uuid("subcategory_id").references(() => subcategories.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const goalRelations = relations(goals, ({ one }) => ({
  category: one(categories, {
    fields: [goals.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [goals.subcategoryId],
    references: [subcategories.id],
  }),
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));
