'use client'

import { env } from '@/env'
import { trpc } from '@/server/client'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { PropsWithChildren, useState } from 'react'
import { toast } from 'sonner'
import SuperJSON from 'superjson'

export function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            toast.error(
              error.message.length > 0
                ? error.message
                : 'Something went wrong! Try refreshing the application.',
            )
          },
        }),
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      }),
  )
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${env.NEXT_PUBLIC_API_URL}/trpc`,
          fetch(url) {
            return fetch(url)
          },
          transformer: SuperJSON,
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
