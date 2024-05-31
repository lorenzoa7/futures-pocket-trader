import { z } from 'zod'

export const pocketSplitOrderSchema = z
  .object({
    pocket: z.object({
      id: z
        .string({
          required_error: 'Please, select a pocket.',
        })
        .min(1, 'Please, select a pocket.'),
      name: z.string(),
      symbols: z.array(z.string()),
    }),
    size: z.coerce.number().gt(0),
    ordersQuantity: z.coerce.number().int().gte(2).lte(20),
    dropPercentage: z.coerce.number().int().gte(0).lt(100),
    side: z.enum(['BUY', 'SELL']),
    orders: z.array(
      z.object({
        symbol: z
          .string({
            required_error: 'Please, select a symbol.',
          })
          .min(1, 'Please, select a symbol.'),
        prices: z.array(z.number()),
        sizes: z.array(z.number()),
      }),
    ),
  })
  .transform((schema) => ({
    ...schema,
    size: schema.size / schema.ordersQuantity,
  }))

export type PocketSplitOrderSchema = z.infer<typeof pocketSplitOrderSchema>
