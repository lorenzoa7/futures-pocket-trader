import { leverageSchema } from '@/schemas/leverage-schema'
import { z } from 'zod'
import { baseApiSchemaWithCredentials } from './base-api-schema'

export const setLeverageSchema = z.object({
  noErrorMessage: z.boolean().optional().default(false),
  api: z
    .object({
      data: leverageSchema,
    })
    .merge(baseApiSchemaWithCredentials),
})

export type SetLeverageSchema = z.infer<typeof setLeverageSchema>
