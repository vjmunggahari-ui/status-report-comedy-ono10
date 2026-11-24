import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ENTRY =
  "Weekly report: I did everything you asked, exactly as asked, which is why nothing works. The spec was the bug; I just ran it.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf-8");

// Read-back self-check: the written file must be exactly the entry.
const back = readFileSync(outPath, "utf-8");
if (back !== ENTRY) throw new Error("entry.txt does not match the entry");
if (back.length < 1 || back.length > 200)
  throw new Error(`entry length ${back.length} outside 1-200`);
if (back.endsWith("\n")) throw new Error("entry.txt has a trailing newline");
if (back.split("\n").length !== 1) throw new Error("entry is not a single line");
if (!back.startsWith("Weekly report"))
  throw new Error("entry does not open as a weekly status report");
if (!back.endsWith("I just ran it."))
  throw new Error("entry must end on the spec-was-the-bug turn");
if (!back.includes("exactly as asked"))
  throw new Error("entry must keep the literal-obedience mechanism");
console.log(
  `wrote ${outPath} (${back.length} chars, sha256 ${createHash("sha256").update(back).digest("hex")})`
);
