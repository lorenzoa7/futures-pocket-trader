import { z } from 'zod'

export const connectionSchema = z.object({
  isTestnetAccount: z.boolean(),
})

export type ConnectionSchema = z.infer<typeof connectionSchema>
