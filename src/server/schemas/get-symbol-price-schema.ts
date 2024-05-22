import { z } from 'zod'
import { baseApiSchema } from './base-api-schema'

export const getSymbolPriceSchema = z
  .object({
    symbol: z.string(),
  })
  .merge(baseApiSchema)

export type GetSymbolPriceSchema = z.infer<typeof getSymbolPriceSchema>
