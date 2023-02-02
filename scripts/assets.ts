import {promises as fsp} from "fs";
import fsSync from "node:fs";
import { r, log } from "./utils";

export async function writeAssets(): Promise<void> {
  const outputDir = r("extension/assets/");
  if (!fsSync.existsSync(outputDir)) {
    await fsp.mkdir(outputDir);
  }
  //TODO: some fonts and images only needed within dist and vite seems to
  //auto copy those to dist/assets so might want to filter fr only image icons, for e.g.
  await fsp.cp(r("src/assets/"), `${outputDir}`, {recursive: true});
  log("PRE", "write assets done");
}

writeAssets();
