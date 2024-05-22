import { binanceApi, testnetBinanceApi } from '@/lib/axios'

export function getApi(isTestnetAccount: boolean) {
  return isTestnetAccount ? testnetBinanceApi : binanceApi
}
