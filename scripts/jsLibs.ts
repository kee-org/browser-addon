import fs from "node:fs/promises";
import fsSync from "node:fs";
import { r, log } from "./utils";

export async function writeJavascriptLibs(): Promise<void> {
  const outputDir = r("extension/lib/");
  if (!fsSync.existsSync(outputDir)) {
    await fs.mkdir(outputDir);
  }
  await fs.cp(r("lib/"), `${outputDir}`, {recursive: true});
  log("PRE", "write JSlibs done");
}

writeJavascriptLibs();
