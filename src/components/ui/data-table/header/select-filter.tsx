import { type Column } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  type SelectOptions,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface SelectFilterProps<T> {
  column: Column<T>;
  label: string;
  options: SelectOptions;
}

export default function SelectFilter<T>({
  column,
  label,
  options,
}: SelectFilterProps<T>) {
  function handleChange(value: string) {
    if (!value) {
      column.setFilterValue(undefined);
      return;
    }

    const option = options.find((option) => {
      return option.value.toString() === value.toString();
    });

    if (option) {
      column.setFilterValue(option.label);
    } else {
      column.setFilterValue(value);
    }
  }

  const current = column.getFilterValue() as string | undefined;

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="justify-center gap-1 border-none">
        {current ? (
          <SelectValue>
            {label}: {current}
          </SelectValue>
        ) : (
          label
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={undefined as any}>
            <span className="opacity-70">Selecione</span>
          </SelectItem>
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value?.toString()}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
