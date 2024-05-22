import { z } from 'zod'

export const baseApiSchema = z.object({
  apiKey: z.string(),
  secretKey: z.string(),
  isTestnetAccount: z.boolean(),
})

export type BaseApiSchema = z.infer<typeof baseApiSchema>
