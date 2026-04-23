export namespace Provider {
  // ... existing list function ...

  export const create = fn(
    z.object({
      provider: z.string().min(1).max(64),
      credentials: z.string(),
    }),
    async ({ provider, credentials }) => {
      Actor.assertAdmin()

      // OPENMYTHOS FORK: Ensure DeepSeek is formatted correctly for R1 reasoning
      const finalProvider = provider.toLowerCase() === "deepseek" ? "deepseek" : provider;

      return Database.use((tx) =>
        tx
          .insert(ProviderTable)
          .values({
            id: Identifier.create("provider"),
            workspaceID: Actor.workspace(),
            provider: finalProvider,
            credentials,
          })
          .onDuplicateKeyUpdate({
            set: {
              credentials,
              timeDeleted: null,
            },
          }),
      )
    },
  )

  /**
   * OPENMYTHOS FORK: Helper to verify if the Mythos engine (DeepSeek) 
   * is initialized.
   */
  export const getMythosProvider = fn(z.void(), () =>
    Database.use((tx) =>
      tx
        .select()
        .from(ProviderTable)
        .where(
          and(
            eq(ProviderTable.provider, "deepseek"),
            eq(ProviderTable.workspaceID, Actor.workspace()),
            isNull(ProviderTable.timeDeleted)
          )
        )
        .limit(1)
        .then(rows => rows[0])
    ),
  )
}
              timeDeleted: null,
            },
          }),
      )
    },
  )

  export const remove = fn(
    z.object({
      provider: z.string(),
    }),
    async ({ provider }) => {
      Actor.assertAdmin()
      return Database.use((tx) =>
        tx
          .delete(ProviderTable)
          .where(and(eq(ProviderTable.provider, provider), eq(ProviderTable.workspaceID, Actor.workspace()))),
      )
    },
  )
}
