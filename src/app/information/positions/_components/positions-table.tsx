'use client'

import { useAccountStore } from '@/hooks/store/use-account-store'
import { trpc } from '@/server/client'

export function PositionsTable() {
  const account = useAccountStore()
  const { data: positions, error } = trpc.getPositions.useQuery(account)

  return (
    <>
      <div>Positions table</div>
    </>
  )
}
