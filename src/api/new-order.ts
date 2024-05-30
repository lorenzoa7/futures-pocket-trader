import { defaultParams } from '@/config/connections'
import { decryptCredentialsKeys } from '@/functions/decrypt-credentials-keys'
import { generateQueryString } from '@/functions/generate-query-string'
import { getApi } from '@/functions/get-api'
import { NewOrderSchema } from '@/server/schemas/new-order-schema'

export type NewOrderResponse = Record<string, string | number | boolean>

export async function newOrder(props: NewOrderSchema['api']) {
  const { type, apiKey, isTestnetAccount, secretKey } = props

  const params =
    type === 'LIMIT'
      ? {
          symbol: props.data.symbol,
          side: props.data.side,
          quantity: props.data.quantity,
          price: props.data.price,
          type: props.type,
          timeInForce: 'GTC',
          recvWindow: defaultParams.recvWindow,
          timestamp: defaultParams.timestamp,
        }
      : {
          symbol: props.data.symbol,
          side: props.data.side,
          quantity: props.data.quantity,
          type: props.type,
          recvWindow: defaultParams.recvWindow,
          timestamp: defaultParams.timestamp,
        }

  const { decryptedApiKey, decryptedSecretKey } = decryptCredentialsKeys({
    apiKey,
    secretKey,
  })

  const query = generateQueryString({ params, secretKey: decryptedSecretKey })
  const api = getApi(isTestnetAccount)

  const response = await api.post<NewOrderResponse>(
    `/fapi/v1/order${query}`,
    undefined,
    {
      headers: {
        'X-MBX-APIKEY': decryptedApiKey ?? '',
      },
    },
  )

  return response.data
}
