import { Link } from "@tanstack/react-router";
import { HTTPError } from "ky";
import {
  ERROR_VARIANT,
  ERROR_VARIANTS,
  type ErrorStateProps,
  type ErrorVariant,
} from "./types";

export function ErrorState({
  message,
  variant = ERROR_VARIANT.GENERIC,
  onRetry,
}: ErrorStateProps) {
  const { icon, title } = ERROR_VARIANTS[variant];

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-app-centered">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">{icon}</div>
        <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
        <p className="text-white/70 text-lg mb-8">{message}</p>
        <div className="flex items-center justify-center gap-4">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function getErrorVariant(error: Error | null): ErrorVariant {
  if (error instanceof HTTPError && error.response.status === 404) {
    return ERROR_VARIANT.NOT_FOUND;
  }

  return ERROR_VARIANT.GENERIC;
}
