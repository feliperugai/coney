import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <Skeleton className="mb-6 h-10 w-48" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div>
              <Skeleton className="mb-2 h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
