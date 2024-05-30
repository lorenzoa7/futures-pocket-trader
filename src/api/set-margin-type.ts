import { defaultParams } from '@/config/connections'
import { decryptCredentialsKeys } from '@/functions/decrypt-credentials-keys'
import { generateQueryString } from '@/functions/generate-query-string'
import { getApi } from '@/functions/get-api'
import { SetMarginTypeSchema } from '@/server/schemas/set-margin-type-schema'

export type SetMarginTypeResponse = {
  code: number
  msg: string
}

export async function setMarginType({
  apiKey,
  secretKey,
  isTestnetAccount,
  data: { marginType, symbol },
}: SetMarginTypeSchema['api']) {
  const params = {
    symbol,
    marginType,
    recvWindow: defaultParams.recvWindow,
    timestamp: defaultParams.timestamp,
  }

  const { decryptedApiKey, decryptedSecretKey } = decryptCredentialsKeys({
    apiKey,
    secretKey,
  })

  const query = generateQueryString({ params, secretKey: decryptedSecretKey })
  const api = getApi(isTestnetAccount)

  const response = await api.post<SetMarginTypeResponse>(
    `/fapi/v1/marginType${query}`,
    undefined,
    {
      headers: {
        'X-MBX-APIKEY': decryptedApiKey ?? '',
      },
    },
  )

  return response.data
}
