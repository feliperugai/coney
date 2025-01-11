import { addDays } from "date-fns";
import { z } from "zod";
import { getEndOfMonth, getStartOfMonth } from "~/lib/date";
import { ReportService } from "~/server/services/report-service";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const ReportInput = z
  .object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .optional();

export const reportsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(ReportInput)
    .query(async ({ ctx, input }) => {
      const service = new ReportService(ctx.db);

      const start = input?.startDate ?? getStartOfMonth();
      const end = input?.endDate ?? getEndOfMonth();
      const startDate = addDays(start, -5);
        console.log(startDate);
      return service.getAll(startDate, end);
    }),
});
