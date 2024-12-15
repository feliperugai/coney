import { FormSelect, type FormSelectProps } from "~/components/ui/select";

type InstallmentSelectProps = Omit<FormSelectProps, "items"> & {
  max?: number;
};

export default function InstallmentsSelect({
  label = "Parcelas",
  name = "totalInstallments",
  max = 12,
  ...props
}: InstallmentSelectProps) {
  return (
    <FormSelect
      name={name}
      label={label}
      items={Array.from({ length: max }, (_, i) => {
        const installment = (i + 1).toString();
        return { value: installment, label: installment };
      })}
      {...props}
    />
  );
}
