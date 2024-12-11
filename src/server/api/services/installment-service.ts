import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { getEndOfMonth, getStartOfMonth } from "~/lib/date";
import { type Database } from "~/server/db";
import { installmentPurchases } from "~/server/db/schema";
import { type InsertInstallmentPurchase } from "~/server/db/tables/installmentsPurchases";

export class InstallmentPurchaseService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(data: InsertInstallmentPurchase) {
    const { date, totalInstallments, amount: amountSt, ...rest } = data;
    const amount = parseFloat(amountSt);
    const startDate = new Date(date);
    const endDate = this.calculateEndDate(startDate, totalInstallments);
    const installmentAmount = amount / totalInstallments;

    const [result] = await this.db
      .insert(installmentPurchases)
      .values({
        ...rest,
        originalAmount: (amount * totalInstallments).toString(),
        totalInstallments,
        startDate,
        endDate,
        installmentAmount,
      })
      .returning();

    return result;
  }

  async update(id: string, data: Partial<InsertInstallmentPurchase>) {
    return this.db
      .update(installmentPurchases)
      .set(data)
      .where(eq(installmentPurchases.id, id))
      .returning();
  }

  async delete(id: string) {
    return this.db
      .delete(installmentPurchases)
      .where(eq(installmentPurchases.id, id));
  }

  async deleteMany(ids: string[]) {
    return this.db
      .delete(installmentPurchases)
      .where(inArray(installmentPurchases.id, ids))
      .returning();
  }

  async getAll(options?: { startDate?: string; endDate?: string }) {
    const start = options?.startDate
      ? new Date(options.startDate)
      : getStartOfMonth();

    const end = options?.endDate ? new Date(options.endDate) : getEndOfMonth();

    return this.db.query.installmentPurchases.findMany({
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
      where: and(
        gte(installmentPurchases.startDate, start),
        lte(installmentPurchases.endDate, end),
      ),
      orderBy: (installmentPurchases, { asc }) =>
        asc(installmentPurchases.startDate),
    });
  }

  async getById(id: string) {
    const result = await this.db
      .select()
      .from(installmentPurchases)
      .where(eq(installmentPurchases.id, id));
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
