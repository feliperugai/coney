import { cn } from "~/lib/utils";
import { Center } from "../center";
import { Skeleton } from "../skeleton";
import { TableCell, TableRow } from "../table";

interface RowSkeletonProps {
  rowCount?: number;
}

export function TableSkeleton({ rowCount = 4 }: RowSkeletonProps) {
  return (
    <>
      {[...Array(rowCount)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className={cn("animate-pulse", "size-5")} />
          </TableCell>
          <TableCell>
            <Center>
              <Skeleton className={cn("animate-pulse", "size-7 rounded-md")} />
            </Center>
          </TableCell>
          <TableCell>
            <Skeleton className={cn("animate-pulse", "h-4 w-[300px]")} />
          </TableCell>
          <TableCell>
            <Skeleton className={cn("animate-pulse", "h-4 w-[200px]")} />
          </TableCell>
          <TableCell>
            <Skeleton className={cn("animate-pulse", "h-4 w-12 rounded-md")} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
