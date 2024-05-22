import { TRPCError } from '@trpc/server'
import { isAxiosError } from 'axios'

type Props = {
  error: unknown
  errorMessage: string
}

export function throwApiError({ error, errorMessage }: Props) {
  const errorDescription =
    isAxiosError(error) &&
    'msg' in error.response?.data &&
    typeof error.response?.data.msg === 'string'
      ? (error.response?.data.msg as string)
      : undefined

  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: `${errorMessage}|${errorDescription}`,
  })
}
