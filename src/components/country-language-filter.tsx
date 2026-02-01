import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { Route } from "~/routes/index";

interface CountryLanguageFilterProps {
  languages: string[];
  isLoading?: boolean;
}

export function CountryLanguageFilter({
  languages,
  isLoading,
}: CountryLanguageFilterProps) {
  const { language } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const handleLanguageChange = (value: string) => {
    navigate({
      search: (prev) => ({ ...prev, language: value || undefined, page: 1 }),
    });
  };

  return (
    <div>
      <label
        htmlFor="filter-language"
        className="block text-white/70 text-sm mb-2"
      >
        Language
      </label>
      <div className="relative">
        <select
          id="filter-language"
          value={language ?? ""}
          onChange={(e) => handleLanguageChange(e.target.value)}
          disabled={isLoading}
          className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white appearance-none focus:outline-none focus:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">All Languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
        />
      </div>
    </div>
  );
}
