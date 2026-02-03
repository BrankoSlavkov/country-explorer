import { SkeletonBox } from "~/components/skeleton-box";
import { SkeletonInfoCard } from "~/components/skeleton-info-card";

export function CountryDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl backdrop-blur-md bg-black/50 border border-white/20 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 flex items-center justify-center p-8 bg-white/5">
            <SkeletonBox className="w-64 h-40 rounded" />
          </div>

          <div className="flex-1 flex items-center justify-center p-8 border-t lg:border-t-0 lg:border-l border-white/10">
            <SkeletonBox className="size-75 rounded" />
          </div>
        </div>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-4">
            <SkeletonBox className="w-12 h-12 rounded" />
            <div>
              <SkeletonBox className="h-8 w-48 mb-2" />
              <SkeletonBox className="h-4 w-64" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonInfoCard />
        <SkeletonInfoCard />
        <SkeletonInfoCard />
        <SkeletonInfoCard />
        <SkeletonInfoCard />
        <SkeletonInfoCard />
      </div>
    </div>
  );
}
