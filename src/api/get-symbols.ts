import { getApi } from '@/functions/get-api'
import { BaseApiSchema } from '@/server/schemas/base-api-schema'

export type GetSymbolsResponse = {
  symbols: {
    symbol: string
    pair: string
    contractType: 'CURRENT_QUARTER' | 'NEXT_QUARTER' | 'PERPETUAL'
    deliveryDate: number
    onboardDate: number
    status: string
    maintMarginPercent: string
    requiredMarginPercent: string
    baseAsset: string
    quoteAsset: string
    marginAsset: string
    pricePrecision: number // please do not use it as tickSize
    quantityPrecision: number // please do not use it as stepSize
    baseAssetPrecision: number
    quotePrecision: number
    underlyingType: string
    underlyingSubType: string[]
    settlePlan: number
    triggerProtect: string
    filters: [
      {
        filterType: 'PRICE_FILTER'
        maxPrice: string
        minPrice: string
        tickSize: string
      },
      {
        filterType: 'LOT_SIZE'
        maxQty: string
        minQty: string
        stepSize: string
      },
      {
        filterType: 'MARKET_LOT_SIZE'
        maxQty: string
        minQty: string
        stepSize: string
      },
      {
        filterType: 'MAX_NUM_ORDERS'
        limit: number
      },
      {
        filterType: 'MAX_NUM_ALGO_ORDERS'
        limit: number
      },
      {
        filterType: 'MIN_NOTIONAL'
        notional: string
      },
      {
        filterType: 'PERCENT_PRICE'
        multiplierUp: string
        multiplierDown: string
        multiplierDecimal: number
      },
    ]
    OrderType: string[]
    timeInForce: string[]
    liquidationFee: string
    marketTakeBound: string
  }[]
}

export async function getSymbols({ isTestnetAccount }: BaseApiSchema) {
  const api = getApi(isTestnetAccount)

  const response = await api.get<GetSymbolsResponse>('/fapi/v1/exchangeInfo')

  return response.data.symbols
}
