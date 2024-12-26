// ~/server/services/GoalService.ts
import { and, eq, gte, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { getEndOfMonth, getStartOfMonth } from "~/lib/date";
import { type Database } from "~/server/db";
import { goals } from "~/server/db/schema";

interface CreateGoal
 {
  userId: string;
  categoryId?: string | null;
  subcategoryId?: string | null;
  startDate: Date;
  endDate: Date;
  amount: string;
}

interface ConflictingGoal {
  id: string;
  amount: string;
  startDate: Date;
  endDate: Date;
}

export class GoalService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async create(dto: CreateGoal) {
    // Validação básica
    if (!dto.categoryId && !dto.subcategoryId) {
      throw new Error("É necessário informar uma categoria ou subcategoria");
    }

    if (dto.categoryId && dto.subcategoryId) {
      throw new Error(
        "Não é possível informar categoria e subcategoria simultaneamente",
      );
    }

    // Verifica metas conflitantes
    const conflictingGoals = await this.findConflictingGoals({
      categoryId: dto.categoryId,
      subcategoryId: dto.subcategoryId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      userId: dto.userId,
    });

    if (conflictingGoals.length > 0) {
      const conflicts = this.analyzeConflicts(dto, conflictingGoals);
      if (conflicts.hasConflict) {
        throw new Error(conflicts.message);
      }
    }

    return this.db.insert(goals).values(dto).returning();
  }

  async findConflictingGoals({
    categoryId,
    subcategoryId,
    startDate,
    endDate,
    userId,
  }: {
    categoryId?: string | null;
    subcategoryId?: string | null;
    startDate: Date;
    endDate: Date;
    userId: string;
  }) {
    return this.db.query.goals.findMany({
      where: and(
        eq(goals.userId, userId),
        or(
          categoryId
            ? eq(goals.categoryId, categoryId)
            : isNull(goals.categoryId),
          subcategoryId
            ? eq(goals.subcategoryId, subcategoryId)
            : isNull(goals.subcategoryId),
        ),
        or(
          and(
            // Nova meta começa durante uma existente
            sql`${goals.startDate} <= ${startDate.toISOString()}`,
            sql`${goals.endDate} >= ${startDate.toISOString()}`,
          ),
          and(
            // Nova meta termina durante uma existente
            sql`${goals.startDate} <= ${endDate.toISOString()}`,
            sql`${goals.endDate} >= ${endDate.toISOString()}`,
          ),
          and(
            // Nova meta engloba uma existente
            sql`${goals.startDate} >= ${startDate.toISOString()}`,
            sql`${goals.endDate} <= ${endDate.toISOString()}`,
          ),
        ),
      ),
    });
  }

  private analyzeConflicts(
    newGoal: CreateGoal,
    existingGoals: ConflictingGoal[],
  ) {
    const newAmount = parseFloat(newGoal.amount);
    let totalExistingAmount = 0;

    for (const goal of existingGoals) {
      totalExistingAmount += parseFloat(goal.amount);
    }

    // Se a nova meta é maior que a soma das existentes no período
    if (newAmount > totalExistingAmount) {
      return {
        hasConflict: true,
        message: `A meta de ${newAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} é maior que a soma das metas existentes no período (${totalExistingAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})`,
      };
    }

    // Se a nova meta é muito menor que as existentes
    if (newAmount < totalExistingAmount * 0.5) {
      return {
        hasConflict: true,
        message: `A meta de ${newAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} é muito menor que a soma das metas existentes no período (${totalExistingAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})`,
      };
    }

    return {
      hasConflict: false,
      message: "",
    };
  }

  async getAll(options?: { startDate?: string; endDate?: string }) {
    const start = options?.startDate
      ? new Date(options.startDate)
      : getStartOfMonth();

    const end = options?.endDate ? new Date(options.endDate) : getEndOfMonth();

    return this.db.query.goals.findMany({
      with: {
        category: { columns: { id: true, name: true } },
        subcategory: { columns: { id: true, name: true } },
      },
      where: and(gte(goals.startDate, start), lte(goals.endDate, end)),
      orderBy: (goals, { desc }) => [desc(goals.startDate)],
    });
  }

  async delete(id: string, userId: string) {
    return this.db
      .delete(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .returning();
  }

  async deleteMany(ids: string[], userId: string) {
    return this.db
      .delete(goals)
      .where(and(inArray(goals.id, ids), eq(goals.userId, userId)))
      .returning();
  }

  async update(id: string, userId: string, data: Partial<CreateGoal>) {
    return this.db
      .update(goals)
      .set(data)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .returning();
  }
}
