import { env } from '@/env'
import CryptoJS from 'crypto-js'

export function encryptKey(key: string) {
  return CryptoJS.AES.encrypt(key, env.NEXT_PUBLIC_SECRET_KEY).toString()
}
