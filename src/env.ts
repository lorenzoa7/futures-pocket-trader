import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['production', 'development', 'test']),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_BINANCE_API_URL: z.string(),
    NEXT_PUBLIC_TESTNET_BINANCE_API_URL: z.string(),
    NEXT_PUBLIC_SECRET_KEY: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BINANCE_API_URL: process.env.NEXT_PUBLIC_BINANCE_API_URL,
    NEXT_PUBLIC_TESTNET_BINANCE_API_URL:
      process.env.NEXT_PUBLIC_TESTNET_BINANCE_API_URL,
    NEXT_PUBLIC_SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
  },
})
