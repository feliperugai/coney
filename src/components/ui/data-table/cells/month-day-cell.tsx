import React from "react";

type MonthDayCellProps = {
  day?: number | null;
  nthBusinessDay?: number | null;
};

export default function MonthDayCell({
  day,
  nthBusinessDay,
}: MonthDayCellProps) {
  return <div>{day ?? nthBusinessDay + "º útil do mês"}</div>;
}
