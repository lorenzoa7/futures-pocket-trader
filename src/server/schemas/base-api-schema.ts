import { z } from 'zod'

export const baseApiSchema = z.object({
  isTestnetAccount: z.boolean(),
})

export const baseApiSchemaWithCredentials = z
  .object({
    apiKey: z.string(),
    secretKey: z.string(),
  })
  .merge(baseApiSchema)

export type BaseApiSchema = z.infer<typeof baseApiSchema>

export type BaseApiSchemaWithCredentials = z.infer<
  typeof baseApiSchemaWithCredentials
>
