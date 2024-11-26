import { cn } from "~/lib/utils";

interface CenterProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Center({ children, className, style }: CenterProps) {
  return (
    <div
      className={cn(
        "flex max-w-[100px] items-center justify-center",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
