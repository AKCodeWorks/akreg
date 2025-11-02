import { existsSync, readFileSync } from "fs";
import path from "path";

function getInstalledDeps(): Record<string, string> {
  const pkgPath = path.resolve("package.json");
  if (!existsSync(pkgPath)) return {};
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  return {
    ...pkg.dependencies,
    ...pkg.devDependencies
  };
}

export { getInstalledDeps };