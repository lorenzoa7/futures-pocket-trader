import { defaultParams } from '@/config/connections'
import { generateQueryString } from '@/functions/generate-query-string'
import { getApi } from '@/functions/get-api'
import { SetLeverageSchema } from '@/server/schemas/set-leverage-schema'

export type SetLeverageResponse = {
  leverage: number
  maxNotionalValue: string
  symbol: string
}

export async function setLeverage({
  apiKey,
  secretKey,
  isTestnetAccount,
  data: { leverage, symbol },
}: SetLeverageSchema['api']) {
  const params = {
    symbol,
    leverage,
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
  }

  const query = generateQueryString({ params, secretKey })
  const api = getApi(isTestnetAccount)

  const response = await api.post<SetLeverageResponse>(
    `/fapi/v1/leverage${query}`,
    undefined,
    {
      headers: {
        'X-MBX-APIKEY': apiKey ?? '',
      },
    },
  )

  return response.data
}
