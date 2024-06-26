import { singleOrderSchema } from '@/schemas/single-order-schema'
import { z } from 'zod'
import { baseApiSchemaWithCredentials } from './base-api-schema'

export const newOrderSchema = z.object({
  noErrorMessage: z.boolean().optional().default(false),
  shouldRefetch: z.boolean().optional().default(false),
  api: z
    .object({ type: z.literal('LIMIT'), data: singleOrderSchema })
    .merge(baseApiSchemaWithCredentials)
    .or(
      z
        .object({
          type: z.literal('MARKET'),
          data: singleOrderSchema.omit({ price: true }),
        })
        .merge(baseApiSchemaWithCredentials),
    ),
})

export type NewOrderSchema = z.infer<typeof newOrderSchema>
