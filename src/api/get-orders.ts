import { defaultParams } from '@/config/connections'
import { generateQueryString } from '@/functions/generate-query-string'
import { getApi } from '@/functions/get-api'
import { BaseApiSchemaWithCredentials } from '@/server/schemas/base-api-schema'

export type Order = {
  orderId: number
  symbol: string
  status: string
  clientOrderId: string
  price: string
  avgPrice: string
  origQty: string
  executedQty: string
  cumQuote: string
  timeInForce: string
  type: string
  reduceOnly: boolean
  closePosition: boolean
  side: 'BUY' | 'SELL'
  positionSide: 'BOTH' | 'LONG' | 'SHORT'
  stopPrice: string
  workingType: string
  priceProtect: boolean
  origType: string
  priceMatch: string
  selfTradePreventionMode: string
  goodTillDate: number
  time: number
  updateTime: number
}

export type GetOrdersResponse = Order[]

export async function getOrders({
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

  const response = await api.get<GetOrdersResponse>(
    `/fapi/v1/openOrders${query}`,
    {
      headers: {
        'X-MBX-APIKEY': apiKey ?? '',
      },
    },
  )

  return response.data
}
