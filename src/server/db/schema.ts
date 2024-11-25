import { pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `coney_${name}`);

import { accounts, accountsRelations } from "./tables/accounts";
import { categories } from "./tables/categories";
import { paymentMethods } from "./tables/payment-method";
import { sessions, sessionsRelations } from "./tables/session";
import { subcategories, subcategoriesRelations } from "./tables/subcategories";
import { users, usersRelations } from "./tables/users";
import { verificationTokens } from "./tables/verificationTokens";

export {
  accounts,
  accountsRelations,
  categories,
  paymentMethods,
  sessions,
  sessionsRelations,
  subcategories,
  subcategoriesRelations,
  users,
  usersRelations,
  verificationTokens,
};
