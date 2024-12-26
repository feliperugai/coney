"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { DateRangePicker } from "~/components/ui/date-range-picker";
import useDeleteGoal from "~/hooks/data/goals/useDeleteGoal";
import { getEndOfMonth, getStartOfMonth } from "~/lib/date";
import { type Goal } from "~/server/db/tables/goals";
import { api } from "~/trpc/react";
import { columns } from "./_components/columns";
import GoalDialog from "./_components/modal";

function getGoal(data: Goal[] | undefined, id: string | null) {
  if (!data) return undefined;
  const found = data.find((cat) => cat.id === id);
  return found ? { ...found, amount: parseFloat(found.amount) } : undefined;
}

export default function GoalsPage() {
  const [goalId, setGoalId] = useQueryState("id");
  const [range, setRange] = useState<DateRange>({
    from: getStartOfMonth(),
    to: getEndOfMonth(),
  });
  const { data, isLoading } = api.goal.getAll.useQuery({
    startDate: format(range.from!, "yyyy-MM-dd"),
    endDate: format(range.to ?? range.from!, "yyyy-MM-dd"),
  });

  const { mutate } = useDeleteGoal();
  const selectedGoal = getGoal(data, goalId);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Metas</h1>
        <DateRangePicker
          onUpdate={({ range }) => setRange(range)}
          initialDateFrom={getStartOfMonth()}
          initialDateTo={new Date()}
          align="start"
          locale="pt-BR"
          showCompare={false}
        />
        <Button onClick={() => setGoalId("new")}>
          <Plus className="mr-2 size-4" />
          Nova
        </Button>
      </div>

      <DataTable
        loading={isLoading}
        onClick={async (goal) => void (await setGoalId(goal.id))}
        onDelete={(rows) => {
          mutate({ ids: rows.map((row) => row.id) });
        }}
        columns={columns}
        data={data}
        enableRowSelection
      />

      {goalId && (
        <GoalDialog
          open={goalId !== null}
          onOpenChange={async (open) => {
            if (!open) await setGoalId(null);
          }}
          initialData={goalId === "new" ? undefined : selectedGoal}
        />
      )}
    </div>
  );
}
