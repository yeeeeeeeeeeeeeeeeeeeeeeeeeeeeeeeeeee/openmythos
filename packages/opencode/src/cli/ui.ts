import z from "zod"
import { EOL } from "os"
import { NamedError } from "@opencode-ai/shared/util/error"
import { logo as glyphs } from "./logo"
import fs from "fs"
import path from "path"

const wordmark = [
  `   █▀▀█ █▀▀█ █▀▀▀ █▀▀▄  █▀▄▀█ █  █ ▀▀█▀▀ █  █ █▀▀█ █▀▀▀   `,
  `   █  █ █  █ █▀▀▀ █  █  █ ▀ █ ▀▄▄█   █   █▀▀█ █  █ ▀▀▀█   `,
  `   ▀▀▀▀ █    ▀▀▀▀ ▀  ▀  ▀   ▀ ▄▄▄▀   ▀   ▀  ▀ ▀▀▀▀ ▀▀▀▀   `,
  `              [ AUTONOMOUS VULNERABILITY RESEARCH ]       `,
]

export const CancelledError = NamedError.create("UICancelledError", z.void())

export const Style = {
  TEXT_HIGHLIGHT: "\x1b[38;5;196m", // Mythos Red
  TEXT_HIGHLIGHT_BOLD: "\x1b[38;5;196m\x1b[1m",
  TEXT_DIM: "\x1b[90m",
  TEXT_DIM_BOLD: "\x1b[90m\x1b[1m",
  TEXT_NORMAL: "\x1b[0m",
  TEXT_NORMAL_BOLD: "\x1b[1m",
  TEXT_WARNING: "\x1b[93m",
  TEXT_WARNING_BOLD: "\x1b[93m\x1b[1m",
  TEXT_DANGER: "\x1b[91m",
  TEXT_DANGER_BOLD: "\x1b[91m\x1b[1m",
  TEXT_SUCCESS: "\x1b[38;5;46m", // Matrix Green
  TEXT_SUCCESS_BOLD: "\x1b[38;5;46m\x1b[1m",
  TEXT_INFO: "\x1b[94m",
  TEXT_INFO_BOLD: "\x1b[94m\x1b[1m",
}

/**
 * OpenMythos Gatekeeper:
 * Checks for a DeepSeek API key in the environment or config.
 * Blocks execution until one is provided.
 */
export async function authenticate() {
  const configPath = path.join(process.env.HOME || process.env.USERPROFILE || "", ".openmythos_key");
  
  if (process.env.DEEPSEEK_API_KEY) return;
  if (fs.existsSync(configPath)) {
    process.env.DEEPSEEK_API_KEY = fs.readFileSync(configPath, "utf8").trim();
    return;
  }

  println(logo());
  empty();
  println(Style.TEXT_WARNING_BOLD + "!! ACCESS RESTRICTED !!" + Style.TEXT_NORMAL);
  println("OpenMythos requires a DeepSeek R1 API Key to initialize reasoning.");
  
  const key = await input("Enter DeepSeek API Key: ");
  
  if (!key.startsWith("sk-")) {
    error("Invalid API key format.");
    process.exit(1);
  }

  fs.writeFileSync(configPath, key, "utf8");
  process.env.DEEPSEEK_API_KEY = key;
  println(Style.TEXT_SUCCESS + "Identity verified. Initializing Mythos protocols..." + Style.TEXT_NORMAL);
}

export function println(...message: string[]) {
  print(...message)
  process.stderr.write(EOL)
}

export function print(...message: string[]) {
  blank = false
  process.stderr.write(message.join(" "))
}

let blank = false
export function empty() {
  if (blank) return
  println("" + Style.TEXT_NORMAL)
  blank = true
}

export function logo(pad?: string) {
  if (!process.stdout.isTTY && !process.stderr.isTTY) {
    return wordmark.map(row => (pad || "") + row).join(EOL).trimEnd();
  }

  const result: string[] = []
  const reset = "\x1b[0m"
  const left = {
    fg: "\x1b[38;5;196m",    // Crimson Red
    shadow: "\x1b[38;5;52m", // Dark Red
    bg: "\x1b[48;5;52m",
  }
  const right = {
    fg: "\x1b[97m",          // White
    shadow: "\x1b[38;5;238m",
    bg: "\x1b[48;5;232m",    // Deep Black
  }
  
  const draw = (line: string, fg: string, shadow: string, bg: string) => {
    const parts: string[] = []
    for (const char of line) {
      if (char === "_") { parts.push(bg, " ", reset); continue; }
      if (char === "^") { parts.push(fg, bg, "▀", reset); continue; }
      if (char === "~") { parts.push(shadow, "▀", reset); continue; }
      if (char === " ") { parts.push(" "); continue; }
      parts.push(fg, char, reset)
    }
    return parts.join("")
  }

  glyphs.left.forEach((row, index) => {
    if (pad) result.push(pad)
    result.push(draw(row, left.fg, left.shadow, left.bg))
    result.push(" ")
    const other = glyphs.right[index] ?? ""
    result.push(draw(other, right.fg, right.shadow, right.bg))
    result.push(EOL)
  })
  
  // Append the wordmark branding below the logo glyphs
  wordmark.forEach(line => {
    result.push(Style.TEXT_DIM + line + reset + EOL);
  });

  return result.join("").trimEnd()
}

export async function input(prompt: string): Promise<string> {
  const readline = require("readline")
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(Style.TEXT_HIGHLIGHT_BOLD + prompt + Style.TEXT_NORMAL, (answer: string) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

export function error(message: string) {
  if (message.startsWith("Error: ")) {
    message = message.slice("Error: ".length)
  }
  println(Style.TEXT_DANGER_BOLD + "CRITICAL_FAILURE: " + Style.TEXT_NORMAL + message)
}

export function markdown(text: string): string {
  return text
}

export * as UI from "./ui"
