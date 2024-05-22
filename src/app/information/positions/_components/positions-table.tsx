'use client'

import { GetPositionResponse } from '@/api/get-positions'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { trpc } from '@/server/client'

export function PositionsTable() {
  const account = useAccountStore()
  const { data: positions } = trpc.getPositions.useQuery(account, {
    select: (data: GetPositionResponse | undefined) => {
      return data?.filter((position) => Number(position.entryPrice) > 0)
    },
  })

  return (
    <>
      <div>Positions table</div>
    </>
  )
}
