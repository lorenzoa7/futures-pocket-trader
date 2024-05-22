import { defaultParams } from '@/config/connections'
import { generateQueryString } from '@/functions/generate-query-string'
import { binanceApi, testnetBinanceApi } from '@/lib/axios'

export type Position = {
  symbol: string
  positionAmt: string
  entryPrice: string
  breakEvenPrice: string
  markPrice: string
  unRealizedProfit: string
  liquidationPrice: string
  leverage: string
  maxNotionalValue: string
  marginType: 'isolated' | 'cross'
  isolatedMargin: string
  isAutoAddMargin: 'false' | 'true'
  positionSide: 'LONG' | 'SHORT' | 'BOTH'
  notional: string
  isolatedWallet: string
  updateTime: number
  isolated: boolean
  adlQuantile: number
}

export type GetPositionResponse = Position[]

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
}

export async function getPositions({
  apiKey,
  secretKey,
  isTestnetAccount,
}: Props) {
  const params = {
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
  }

  const query = generateQueryString({ params, secretKey })
  const api = isTestnetAccount ? testnetBinanceApi : binanceApi

  const response = await api.get(`/fapi/v2/positionRisk${query}`, {
    headers: {
      'X-MBX-APIKEY': apiKey ?? '',
    },
  })

  return response
}
