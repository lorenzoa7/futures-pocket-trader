import { z } from 'zod'

export const pocketInformationSchema = z.object({
  name: z.string().min(1, 'This field is required.'),
})

export type PocketInformationSchema = z.infer<typeof pocketInformationSchema>
