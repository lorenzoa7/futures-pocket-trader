import { defaultParams } from '@/config/connections'
import { generateQueryString } from '@/functions/generate-query-string'
import { getApi } from '@/functions/get-api'
import { GetSymbolPriceSchema } from '@/server/schemas/get-symbol-price-schema'

export type GetSymbolPriceResponse = {
  symbol: string
  price: string
  time: number
}

export async function getSymbolPrice({
  isTestnetAccount,
  symbol,
}: GetSymbolPriceSchema) {
  if (symbol === '') {
    return 0
  }

  const params = {
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
    symbol,
  }
  const query = generateQueryString({ params })

  const api = getApi(isTestnetAccount)

  const response = await api.get<GetSymbolPriceResponse>(
    `/fapi/v2/ticker/price${query}`,
  )

  return Number(response.data.price)
}
