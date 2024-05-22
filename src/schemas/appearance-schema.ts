import { z } from 'zod'

export const appearanceSchema = z.object({
  theme: z.string().optional(),
})

export type AppearanceSchema = z.infer<typeof appearanceSchema>
