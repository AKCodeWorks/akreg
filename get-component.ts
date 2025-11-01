// get-components.ts
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { execSync } from "child_process";
import { argv, exit, stdin, stdout } from "process";
import readline from "readline";

const BASE_URL =
  "https://raw.githubusercontent.com/AKCodeWorks/akui/refs/heads/main/src/registry";
const REGISTRY_URL = `${BASE_URL}/registry.json`;

type RegistryEntry = {
  deps?: string[];
  "dev-deps"?: string[];
  components: { file: string }[];
};

type Registry = Record<string, RegistryEntry>;

async function detectPackageManager(): Promise<"npm" | "pnpm" | "yarn" | "bun"> {
  if (process.env.npm_execpath?.includes("pnpm")) return "pnpm";
  if (process.env.npm_execpath?.includes("yarn")) return "yarn";
  if (process.env.npm_execpath?.includes("bun")) return "bun";
  return "npm";
}

function ask(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  return new Promise((resolve) => {
    rl.question(`${question} (y/N): `, (ans) => {
      rl.close();
      resolve(/^y(es)?$/i.test(ans.trim()));
    });
  });
}

async function main(): Promise<void> {
  const componentKey = argv[2];
  if (!componentKey) {
    console.error("Usage: ts-node get-components.ts <component-key>");
    exit(1);
  }

  console.log(`Fetching registry from: ${REGISTRY_URL}`);
  const res = await fetch(REGISTRY_URL);
  if (!res.ok) {
    console.error("Failed to fetch registry file.");
    exit(1);
  }

  const registry: Registry = await res.json();
  const entry = registry[componentKey];
  if (!entry) {
    console.error(`Component "${componentKey}" not found in registry.`);
    exit(1);
  }

  const targetDir = path.resolve("src/lib/components/akui", componentKey);
  mkdirSync(targetDir, { recursive: true });

  for (const c of entry.components) {
    const rawUrl = `${BASE_URL}/${c.file}`;
    const fileName = path.basename(c.file);
    const dest = path.join(targetDir, fileName);

    console.log(`Fetching ${rawUrl}`);
    const resp = await fetch(rawUrl);
    if (!resp.ok) {
      console.error(`Failed to fetch ${rawUrl}`);
      continue;
    }

    const content = await resp.text();
    writeFileSync(dest, content, "utf8");
    console.log(`Created ${dest}`);
  }

  const pkgManager = await detectPackageManager();
  const deps = entry.deps || [];
  const devDeps = entry["dev-deps"] || [];

  if (deps.length || devDeps.length) {
    const confirm = await ask(
      `Install dependencies using ${pkgManager}?`
    );

    if (confirm) {
      try {
        if (deps.length)
          execSync(`${pkgManager} add ${deps.join(" ")}`, { stdio: "inherit" });

        if (devDeps.length) {
          const flag = pkgManager === "npm" ? "--save-dev" : "-D";
          execSync(`${pkgManager} add ${flag} ${devDeps.join(" ")}`, {
            stdio: "inherit",
          });
        }
      } catch {
        console.error("Error installing dependencies.");
      }
    } else {
      console.log("Skipped dependency installation.");
    }
  }

  console.log(`✅ Installed component "${componentKey}" successfully.`);
}

main().catch((err) => {
  console.error(err);
  exit(1);
});