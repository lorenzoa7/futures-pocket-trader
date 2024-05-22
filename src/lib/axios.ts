import { env } from '@/env'
import axios from 'axios'

export const binanceApi = axios.create({
  baseURL: env.NEXT_PUBLIC_BINANCE_API_URL,
})

export const testnetBinanceApi = axios.create({
  baseURL: env.NEXT_PUBLIC_TESTNET_BINANCE_API_URL,
})
