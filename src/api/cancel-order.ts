import { defaultParams } from '@/config/connections'
import { generateQueryString } from '@/functions/generate-query-string'
import { getApi } from '@/functions/get-api'
import { CancelOrderSchema } from '@/server/schemas/cancel-order-schema'

export type CancelOrderResponse = {
  clientOrderId: string
  cumQty: string
  cumQuote: string
  executedQty: string
  orderId: number
  origQty: string
  origType: string
  price: string
  reduceOnly: false
  side: 'BUY' | 'SELL'
  positionSide: 'SHORT' | 'LONG' | 'BOTH'
  status: string
  stopPrice: string
  closePosition: boolean // if Close-All
  symbol: string
  timeInForce: string
  type: string
  activatePrice: string
  priceRate: string
  updateTime: number
  workingType: string
  priceProtect: boolean
  priceMatch: string
  selfTradePreventionMode: string
  goodTillDate: number
}

export async function cancelOrder({
  apiKey,
  secretKey,
  isTestnetAccount,
  symbol,
  orderId,
}: CancelOrderSchema['api']) {
  const params = {
    symbol,
    orderId,
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
  }

  const query = generateQueryString({ params, secretKey })
  const api = getApi(isTestnetAccount)

  const response = await api.delete<CancelOrderResponse>(
    `/fapi/v1/order${query}`,
    {
      headers: {
        'X-MBX-APIKEY': apiKey ?? '',
      },
    },
  )

  return response.data
}
