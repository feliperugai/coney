// eslint-disable @typescript-eslint/no-unused-vars

import * as ReactTable from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  export * from "@tanstack/react-table";

  export interface ColumnDefBase<TData, TValue = any> {
    className?: string;
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}
