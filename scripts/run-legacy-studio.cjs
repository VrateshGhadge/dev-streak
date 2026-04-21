const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const envPath = path.resolve(process.cwd(), "packages/db/.env");
const schemaPath = path.resolve(process.cwd(), "packages/db/prisma/schema.prisma");
const tempSchemaPath = path.resolve(
  process.cwd(),
  "packages/db/prisma/.schema.legacy.studio.prisma"
);

const envRaw = fs.readFileSync(envPath, "utf8");
const schemaRaw = fs.readFileSync(schemaPath, "utf8");

let directUrl = "";
for (const line of envRaw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  if (!trimmed.startsWith("DIRECT_URL")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  directUrl = trimmed.slice(idx + 1).trim();
  if (
    (directUrl.startsWith('"') && directUrl.endsWith('"')) ||
    (directUrl.startsWith("'") && directUrl.endsWith("'"))
  ) {
    directUrl = directUrl.slice(1, -1);
  }
}

if (!directUrl) {
  console.error("DIRECT_URL missing in packages/db/.env");
  process.exit(1);
}

const legacySchema = schemaRaw.replace(
  /datasource\s+db\s*\{[\s\S]*?\}/m,
  `datasource db {\n  provider = "postgresql"\n  url      = "${directUrl}"\n}`
);

fs.writeFileSync(tempSchemaPath, legacySchema);

const studio = spawn(
  "npx",
  [
    "-y",
    "prisma@6.16.2",
    "studio",
    "--schema",
    "./packages/db/prisma/.schema.legacy.studio.prisma",
  ],
  { stdio: "inherit", shell: true }
);

studio.on("exit", (code) => {
  try {
    fs.unlinkSync(tempSchemaPath);
  } catch {}
  process.exit(code ?? 0);
});
