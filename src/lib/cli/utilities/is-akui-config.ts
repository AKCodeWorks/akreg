import type { AkuiConfig } from "./default-config.js";
import { allowedKeys } from "./default-config.js";

/** Type guard for validating the config shape. */
function isAkuiConfig(value: unknown): value is AkuiConfig {
  if (typeof value !== "object" || value === null) return false;
  return Object.keys(value).every((k) => allowedKeys.includes(k));
}

export { isAkuiConfig }