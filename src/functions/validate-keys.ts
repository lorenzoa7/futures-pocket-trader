import { TRPCError } from '@trpc/server'

type Props = {
  apiKey: string
  secretKey: string
}

export function validateKeys({ apiKey, secretKey }: Props) {
  if (apiKey.length === 0 || secretKey.length === 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message:
        'You have to set your credentials keys in order to make this request.',
    })
  }
}
