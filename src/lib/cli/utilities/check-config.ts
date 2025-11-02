import type { AkuiConfig } from "./default-config.js";
import path from "path";
import fs from "fs";
import { isAkuiConfig } from "./is-akui-config.js";



/**
 * Attempts to load `akui.config.js` or `akui.config.js` from the current working directory.
 * Returns the config object if valid, otherwise null.
 */
export async function getAkuiConfig(): Promise<AkuiConfig | null> {
  const cwd = process.cwd();

  // making this an array so add more files types later if needed....
  const possibleFiles = [
    path.join(cwd, "akui.config.js")
  ];

  const configPath = possibleFiles.find((p) => fs.existsSync(p));
  if (!configPath) return null;

  try {
    const mod = await import(pathToFileUrl(configPath).href);
    const config = mod.default ?? mod.config ?? mod;

    if (!isAkuiConfig(config)) {
      // don't care too much about why, just return null
      return null;
    }

    return config;
  } catch (err) {
    console.error("⚠ Failed to load akui.config:", err);
    return null;
  }
}


function pathToFileUrl(filePath: string): URL {
  const resolved = path.resolve(filePath);
  const url = new URL(`file://${resolved}`);
  return url;
}