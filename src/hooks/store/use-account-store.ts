import { appStorageKey, storageKeys } from '@/config/storage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Pocket = {
  id: string
  name: string
  symbols: string[]
}

type Props = {
  apiKey: string
  secretKey: string
  isTestnetAccount: boolean
  displayPwaButton: boolean
  pockets: Pocket[]
  selectedPocketId?: string
}

export const useAccountStore = create<Props>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_) => ({
      apiKey: '',
      secretKey: '',
      isTestnetAccount: false,
      displayPwaButton: true,
      pockets: [],
      selectedPocketId: undefined,
    }),
    {
      name: `${appStorageKey}:${storageKeys.account}`,
    },
  ),
)
