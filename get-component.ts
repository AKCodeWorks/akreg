// get-components.ts
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { execSync } from "child_process";
import { argv, exit, stdin, stdout } from "process";
import readline from "readline";

type ComponentSchema = {
  name: string;
  components: {
    url: string;
    name: string;
    deps?: string[];
    "dev-deps"?: string[];
  }[];
};

async function detectPackageManager(): Promise<"npm" | "pnpm" | "yarn" | "bun"> {
  if (process.env.npm_execpath?.includes("pnpm")) return "pnpm";
  if (process.env.npm_execpath?.includes("yarn")) return "yarn";
  if (process.env.npm_execpath?.includes("bun")) return "bun";
  return "npm";
}

function ask(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  return new Promise((resolve) => {
    rl.question(`${question} (y/N): `, (answer) => {
      rl.close();
      resolve(/^y(es)?$/i.test(answer.trim()));
    });
  });
}

async function main(): Promise<void> {
  const remoteJsonUrl = argv[2];
  if (!remoteJsonUrl) {
    console.error("Usage: ts-node get-components.ts <remote-json-url>");
    exit(1);
  }

  console.log(`Fetching schema from: ${remoteJsonUrl}`);
  const res = await fetch(remoteJsonUrl);
  if (!res.ok) {
    console.error("Failed to fetch schema.");
    exit(1);
  }

  const schema: ComponentSchema = await res.json();
  const baseDir = path.resolve("src/lib/components/akui", schema.name);
  mkdirSync(baseDir, { recursive: true });

  for (const c of schema.components) {
    const targetDir = path.join(baseDir, c.name);
    mkdirSync(targetDir, { recursive: true });

    console.log(`Fetching ${c.name}...`);
    const resp = await fetch(c.url);
    if (!resp.ok) {
      console.error(`Failed to fetch ${c.url}`);
      continue;
    }

    const fileContent = await resp.text();
    const targetPath = path.join(targetDir, `${c.name}.svelte`);
    writeFileSync(targetPath, fileContent, "utf8");
    console.log(`Created ${targetPath}`);
  }

  // Dependency handling
  const pkgManager = await detectPackageManager();
  const deps = schema.components.flatMap((c) => c.deps || []);
  const devDeps = schema.components.flatMap((c) => c["dev-deps"] || []);

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

  console.log("All components fetched successfully.");
}

main().catch((err) => {
  console.error(err);
  exit(1);
});