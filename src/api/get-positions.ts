import { defaultParams } from '@/config/connections'
import { generateQueryString } from '@/functions/generate-query-string'
import { getApi } from '@/functions/get-api'
import { BaseApiSchemaWithCredentials } from '@/server/schemas/base-api-schema'

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

export async function getPositions({
  apiKey,
  secretKey,
  isTestnetAccount,
}: BaseApiSchemaWithCredentials) {
  const params = {
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
  }

  const query = generateQueryString({ params, secretKey })
  const api = getApi(isTestnetAccount)

  const response = await api.get<GetPositionResponse>(
    `/fapi/v2/positionRisk${query}`,
    {
      headers: {
        'X-MBX-APIKEY': apiKey ?? '',
      },
    },
  )

  return response.data
}
