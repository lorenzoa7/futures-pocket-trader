import { decryptKey } from './decrypt-key'

type Props = {
  apiKey: string
  secretKey: string
}

export function decryptCredentialsKeys({ apiKey, secretKey }: Props) {
  const decryptedApiKey = decryptKey(apiKey)
  const decryptedSecretKey = decryptKey(secretKey)

  return { decryptedApiKey, decryptedSecretKey }
}
