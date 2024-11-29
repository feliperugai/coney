import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `coney_${name}`);

import { accounts, accountsRelations } from "./tables/accounts";
import { categories } from "./tables/categories";
import { incomes } from "./tables/income";
import { paymentMethods } from "./tables/payment-method";
import { recipientRelations, recipients } from "./tables/recipients";
import { sessions, sessionsRelations } from "./tables/session";
import { subcategories, subcategoriesRelations } from "./tables/subcategories";
import { users, usersRelations } from "./tables/users";
import { verificationTokens } from "./tables/verificationTokens";

export {
  accounts,
  accountsRelations,
  categories,
  incomes,
  paymentMethods,
  recipientRelations,
  recipients,
  sessions,
  sessionsRelations,
  subcategories,
  subcategoriesRelations,
  users,
  usersRelations,
  verificationTokens,
};
