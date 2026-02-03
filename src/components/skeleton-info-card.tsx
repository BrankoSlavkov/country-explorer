import { SkeletonBox } from "~/components/skeleton-box";

export function SkeletonInfoCard() {
  return (
    <div className="rounded-xl backdrop-blur-md bg-black/50 border border-white/20 p-6">
      <div className="flex items-center gap-2 mb-4">
        <SkeletonBox className="w-6 h-6 rounded" />
        <SkeletonBox className="h-5 w-32" />
      </div>
      <div className="space-y-3">
        <div>
          <SkeletonBox className="h-3 w-16 mb-1" />
          <SkeletonBox className="h-4 w-24" />
        </div>
        <div>
          <SkeletonBox className="h-3 w-16 mb-1" />
          <SkeletonBox className="h-4 w-32" />
        </div>
        <div>
          <SkeletonBox className="h-3 w-16 mb-1" />
          <SkeletonBox className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
