import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { type z } from "zod";
import { getEndOfMonth, getStartOfMonth } from "~/lib/date";
import { type Database } from "~/server/db";
import { transactions } from "~/server/db/schema";
import {
  type NewTransaction,
  type insertTransactionSchema,
} from "~/server/db/tables/transactions";

export class TransactionService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(data: NewTransaction) {
    const [result] = await this.db
      .insert(transactions)
      .values(data)
      .returning();

    return result;
  }

  async update(
    id: string,
    data: Partial<z.infer<typeof insertTransactionSchema>>,
  ) {
    return this.db
      .update(transactions)
      .set(data)
      .where(eq(transactions.id, id))
      .returning();
  }

  async delete(id: string) {
    return this.db.delete(transactions).where(eq(transactions.id, id));
  }

  async deleteMany(ids: string[]) {
    return this.db
      .delete(transactions)
      .where(inArray(transactions.id, ids))
      .returning();
  }

  async getAll(options?: { startDate?: string; endDate?: string }) {
    const start = options?.startDate
      ? new Date(options.startDate)
      : getStartOfMonth();

    const end = options?.endDate ? new Date(options.endDate) : getEndOfMonth();

    return this.db.query.transactions.findMany({
      with: {
        paymentMethod: {
          columns: { id: true, name: true, image: true, color: true },
        },
        category: { columns: { id: true, name: true } },
        subcategory: { columns: { id: true, name: true } },
        recipient: {
          columns: { id: true, name: true, image: true, color: true },
        },
      },
      where: and(gte(transactions.date, start), lte(transactions.date, end)),
      orderBy: (transactions, { asc }) => asc(transactions.date),
    });
  }

  async getById(id: string) {
    const result = await this.db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));
    return result[0];
  }
}
