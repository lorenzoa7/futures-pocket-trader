import { marginTypeSchema } from '@/schemas/margin-type-schema'
import { z } from 'zod'
import { baseApiSchemaWithCredentials } from './base-api-schema'

export const setMarginTypeSchema = z.object({
  noErrorMessage: z.boolean().optional().default(false),
  api: z
    .object({
      data: marginTypeSchema,
    })
    .merge(baseApiSchemaWithCredentials),
})

export type SetMarginTypeSchema = z.infer<typeof setMarginTypeSchema>
