import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { type z } from "zod";
import { getEndOfMonth, getStartOfMonth } from "~/lib/date";
import { type Database } from "~/server/db";
import { installments, transactions } from "~/server/db/schema";
import {
  type NewTransaction,
  type insertTransactionSchema,
} from "~/server/db/tables/transactions";

type CreateTransactionInput = NewTransaction & {
  installmentCount?: number | null;
};

export class TransactionService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(input: CreateTransactionInput) {
    const { installmentCount, ...data } = input;

    return this.db.transaction(async (tx) => {
      const [transaction] = await tx
        .insert(transactions)
        .values(data)
        .returning();

      if (!transaction?.id) {
        return tx.rollback();
      }

      if (installmentCount) {
        const installmentAmount = parseFloat(data.amount) / installmentCount;

        const [installment] = await tx
          .insert(installments)
          .values({
            totalInstallments: installmentCount,
            startDate: data.date,
            endDate: this.calculateEndDate(data.date, installmentCount),
            originalAmount: data.amount,
            installmentAmount: installmentAmount.toString(),
          })
          .returning();
        console.log({ installment });
        if (!installment?.id) return tx.rollback();

        for (let i = 1; i <= installmentCount; i++) {
          await tx.insert(transactions).values({
            ...data,
            installmentId: installment.id,
            installment: i,
            amount: installmentAmount.toString(),
            date: this.calculateInstallmentDate(data.date, i),
          });
        }
      }

      return transaction;
    });
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

  private calculateEndDate(startDate: Date, totalInstallments: number): Date {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + totalInstallments - 1);
    return endDate;
  }

  private calculateInstallmentDate(
    startDate: Date,
    currentInstallment: number,
  ): Date {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + currentInstallment - 1);
    return date;
  }
}
