import type { ValueOf } from "~/types";

export const ERROR_VARIANT = {
  NOT_FOUND: "not-found",
  GENERIC: "generic",
} as const;

export type ErrorVariant = ValueOf<typeof ERROR_VARIANT>;

type ErrorVariantValue = {
  icon: string;
  title: string;
};

export const ERROR_VARIANTS: Record<ErrorVariant, ErrorVariantValue> = {
  [ERROR_VARIANT.NOT_FOUND]: {
    icon: "🌍",
    title: "Country Not Found",
  },
  [ERROR_VARIANT.GENERIC]: {
    icon: "⚠️",
    title: "Something Went Wrong",
  },
};

export type ErrorStateProps = {
  message: string;
  variant?: ErrorVariant;
};
