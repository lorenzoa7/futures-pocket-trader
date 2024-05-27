import { TRPCClientError } from '@trpc/client'
import { toast } from 'sonner'

export function resolveError(
  error: unknown,
  toastErrorMessage: string | undefined,
) {
  if (error instanceof TRPCClientError) {
    const [errorTitle, errorMessage] = error.message.split('|')
    toast.error(errorTitle, {
      description:
        errorMessage && errorMessage.length > 0 ? errorMessage : undefined,
    })
    return
  }

  if (toastErrorMessage) {
    toast.error("Couldn't create a close market order.")
  }
}
