import { z } from 'zod'

export const credentialsSchema = z.object({
  apiKey: z.string().min(1, 'This field is required.'),
  secretKey: z.string().min(1, 'This field is required.'),
})

export type CredentialsSchema = z.infer<typeof credentialsSchema>
