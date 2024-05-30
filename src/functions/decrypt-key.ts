import { env } from '@/env'
import CryptoJS from 'crypto-js'

export function decryptKey(encryptedKey: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedKey, env.NEXT_PUBLIC_SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
