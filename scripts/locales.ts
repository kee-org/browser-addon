import fs from "node:fs/promises";
import fsSync from "node:fs";
import { r, log } from "./utils";

export async function writeLocales(): Promise<void> {
  const outputDir = r("extension/_locales/");
  if (!fsSync.existsSync(outputDir)) {
    await fs.mkdir(outputDir);
  }
  await fs.cp(r("_locales/"), `${outputDir}`, {recursive: true});
  log("PRE", "write locales done");
}

writeLocales();
