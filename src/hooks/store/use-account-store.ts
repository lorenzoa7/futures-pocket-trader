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
      pockets: [
        {
          id: '08696eee-6de9-46c8-9e00-dc5e620bda9e',
          name: 'Main',
          symbols: ['ETHUSDT', 'BNBUSDT', 'ADAUSDT'],
        },
        {
          id: 'd7490b3c-55ca-42e0-94cd-f20aff2296fb',
          name: 'Test',
          symbols: ['LINKUSDT', 'ATOMUSDT'],
        },
      ],
      selectedPocketId: undefined,
    }),
    {
      name: `${appStorageKey}:${storageKeys.account}`,
    },
  ),
)
