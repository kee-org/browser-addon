import { resolve } from "path";
import { bgCyan, black } from "kolorist";

export const port = parseInt(process.env.PORT || "") || 3303;
export const r = (...args: string[]) => resolve(__dirname, "..", ...args);
export const isDev = process.env.NODE_ENV !== "production";
export const isBeta = process.env.VITE_KEE_CHANNEL === "beta";
export const isChrome = process.env.BROWSER_TARGET === "chrome";

export function log(name: string, message: string) {
  console.log(black(bgCyan(` ${name} `)), message);
}
