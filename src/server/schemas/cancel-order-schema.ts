import { z } from 'zod'
import { baseApiSchemaWithCredentials } from './base-api-schema'

export const cancelOrderSchema = z.object({
  noErrorMessage: z.boolean().optional().default(false),
  shouldRefetch: z.boolean().optional().default(false),
  api: z
    .object({ symbol: z.string(), orderId: z.coerce.number() })
    .merge(baseApiSchemaWithCredentials),
})

export type CancelOrderSchema = z.infer<typeof cancelOrderSchema>
