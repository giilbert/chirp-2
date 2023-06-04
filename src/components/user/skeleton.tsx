import { Skeleton } from "../ui/skeleton";

export const UserSkeleton: React.FC = () => (
  <div className="flex gap-4 border-b p-4">
    <div className="w-12">
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>

    <div className="w-full">
      <Skeleton className="max-w-80 mt-2 h-4 w-40" />
      <Skeleton className="max-w-80 mt-2 h-4 w-60" />
      <div className="flex gap-1">
        <Skeleton className="max-w-80 mt-2 h-4 w-24" />
        <Skeleton className="max-w-80 mt-2 h-4 w-24" />
        <Skeleton className="max-w-80 mt-2 h-4 w-24" />
      </div>
    </div>
  </div>
);
