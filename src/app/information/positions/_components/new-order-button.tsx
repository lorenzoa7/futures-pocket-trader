'use client'

import { Button } from '@/components/ui/button'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { trpc } from '@/server/client'

export function NewOrderButton() {
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()
  const { mutateAsync: newOrder } = trpc.newOrder.useMutation()

  return (
    <>
      <Button
        onClick={() =>
          newOrder({
            api: {
              apiKey,
              secretKey,
              isTestnetAccount,
              type: 'MARKET',
              data: {
                symbol: 'BTCUSDT',
                side: 'BUY',
                isUsdtQuantity: true,
                quantity: 500,
              },
            },
          })
        }
      >
        Criar ordem
      </Button>
    </>
  )
}
