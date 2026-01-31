import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  if (!canShare) {
    return null;
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        url: window.location.href,
      });
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
      aria-label="Share"
    >
      <Share2 size={20} />
    </button>
  );
}
