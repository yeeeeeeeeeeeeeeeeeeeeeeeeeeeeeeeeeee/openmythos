import { Schema } from "effect"
import z from "zod"
import { zod, ZodOverride } from "@/util/effect-zod"
import { withStatics } from "@/util/schema"

/**
 * OpenMythos Model Lockdown
 * By using Schema.Literal, we force the configuration to only accept 
 * the DeepSeek R1 reasoning engine, effectively creating a dedicated 
 * autonomous security research environment.
 */
export const ConfigModelID = Schema.Literal("deepseek-reasoner").pipe(
  // We keep the metadata annotation for compatibility with the TUI,
  // but the validation is now strictly limited to the Mythos engine.
  Schema.annotate({
    [ZodOverride]: z.literal("deepseek-reasoner").meta({ 
      $ref: "https://models.dev" 
    }),
  }),
  withStatics((s) => ({ zod: zod(s) }))
)

export type ConfigModelID = Schema.Schema.Type<typeof ConfigModelID>
