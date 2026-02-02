import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

import type { Country } from "~/api/countries.types";
import { cn } from "~/lib/cn";
import { exportToCSV } from "~/lib/export";

interface ExportButtonProps {
  country?: Country;
}

export function ExportButton({ country }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!country) return;

    setIsExporting(true);

    const filename = `${country.name.common.toLowerCase().replace(/\s+/g, "-")}-details`;

    try {
      exportToCSV(country, filename);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={!country || isExporting}
      className={cn(
        "p-2 rounded-lg transition-colors cursor-pointer",
        "text-white/70 hover:text-white hover:bg-white/10",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      )}
      aria-label="Export country data as CSV"
    >
      {isExporting ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <Download size={20} />
      )}
    </button>
  );
}
