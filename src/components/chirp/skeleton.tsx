import { Skeleton } from "../ui/skeleton";

export const ChirpSkeleton: React.FC = () => {
  return (
    <div className="flex w-full gap-4">
      <div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
      <div className="w-full">
        <Skeleton className="h-4 w-32" />
        <div className="mt-3 flex flex-col gap-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};
