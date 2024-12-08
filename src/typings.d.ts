// global.d.ts ou em um arquivo de declaração de tipos
import * as ReactTable from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  export * from "@tanstack/react-table";

  export interface ColumnDefBase<TData, TValue = any> {
    className?: string;
  }
}
