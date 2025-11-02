import { existsSync } from "fs";
import path from "path";

function detectPackageManager(): "npm" | "pnpm" | "yarn" | "bun" {
  const cwd = process.cwd();
  switch (true) {
    case existsSync(path.join(cwd, "pnpm-lock.yaml")):
      return "pnpm";
    case existsSync(path.join(cwd, "yarn.lock")):
      return "yarn";
    case existsSync(path.join(cwd, "bun.lock")):
      return "bun";
    case existsSync(path.join(cwd, "package-lock.json")):
      return "npm";
    default:
      return "npm";
  }
}

export { detectPackageManager };