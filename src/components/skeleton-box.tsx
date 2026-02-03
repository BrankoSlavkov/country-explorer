import { cn } from "~/lib/cn";

export function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white/10 rounded animate-pulse", className)} />
  );
}
