import {
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Image,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import type { Country } from "~/api/countries.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/cn";
import {
  type ExportFormat,
  exportToCSV,
  exportToJSON,
  exportToPDF,
  exportToPNG,
} from "~/lib/export";

interface ExportButtonProps {
  country: Country | undefined;
  detailsRef: React.RefObject<HTMLDivElement | null>;
}

const exportOptions: {
  format: ExportFormat;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    format: "pdf",
    label: "PDF Document",
    icon: <FileText size={16} />,
    description: "Formatted document",
  },
  {
    format: "json",
    label: "JSON Data",
    icon: <FileJson size={16} />,
    description: "Structured data",
  },
  {
    format: "csv",
    label: "CSV Spreadsheet",
    icon: <FileSpreadsheet size={16} />,
    description: "Excel compatible",
  },
  {
    format: "png",
    label: "PNG Image",
    icon: <Image size={16} />,
    description: "Screenshot",
  },
];

export function ExportButton({ country, detailsRef }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (!country) return;

    setIsExporting(true);
    setExportFormat(format);

    const filename = `${country.name.common.toLowerCase().replace(/\s+/g, "-")}-details`;

    try {
      switch (format) {
        case "json":
          exportToJSON(country, filename);
          break;
        case "csv":
          exportToCSV(country, filename);
          break;
        case "pdf":
          await exportToPDF(country, filename);
          break;
        case "png":
          if (detailsRef.current) {
            await exportToPNG(detailsRef.current, filename);
          }
          break;
      }
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={!country || isExporting}
          className={cn(
            "p-2 rounded-lg transition-colors cursor-pointer",
            "text-white/70 hover:text-white hover:bg-white/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
          aria-label="Export country data"
        >
          {isExporting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Download size={20} />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <div className="space-y-1">
          <p className="text-xs text-white/50 px-2 py-1">Export as</p>
          {exportOptions.map((option) => (
            <button
              key={option.format}
              type="button"
              onClick={() => handleExport(option.format)}
              disabled={isExporting}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-2 rounded-md",
                "text-left text-sm text-white/90",
                "hover:bg-white/10 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isExporting && exportFormat === option.format && "bg-white/10",
              )}
            >
              <span className="text-white/70">{option.icon}</span>
              <div className="flex-1">
                <p className="font-medium">{option.label}</p>
                <p className="text-xs text-white/50">{option.description}</p>
              </div>
              {isExporting && exportFormat === option.format && (
                <Loader2 size={14} className="animate-spin text-white/50" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
