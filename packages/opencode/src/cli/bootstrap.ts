import { AppRuntime } from "@/effect/app-runtime"
import { InstanceBootstrap } from "../project/bootstrap"
import { Instance } from "../project/instance"
import { UI } from "../ui" // Ensure this points to your modified ui.ts

export async function bootstrap<T>(directory: string, cb: () => Promise<T>) {
  return Instance.provide({
    directory,
    init: async () => {
      // 1. Run the Mythos Gatekeeper before any other initialization
      await UI.authenticate()
      
      // 2. Proceed with standard AppRuntime bootstrap
      return AppRuntime.runPromise(InstanceBootstrap)
    },
    fn: async () => {
      try {
        const result = await cb()
        return result
      } finally {
        await Instance.dispose()
      }
    },
  })
}
