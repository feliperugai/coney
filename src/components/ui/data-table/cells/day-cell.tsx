import { format } from "date-fns";

export default function DayCell({ value }: { value: Date | string }) {
  return <span className="text-sm">{format(value, "dd")}</span>;
}
