import { z } from 'zod'

export const pocketSymbolsSchema = z.object({
  symbols: z.array(
    z.object({
      name: z
        .string({
          required_error: 'Please, select a pocket.',
        })
        .min(1, 'Please, select a pocket.'),
    }),
  ),
})

export type PocketSymbolsSchema = z.infer<typeof pocketSymbolsSchema>
