import { useAccountStore } from '@/hooks/store/use-account-store'
import {
  SingleOrderSchema,
  singleOrderSchema,
} from '@/schemas/single-order-schema'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  quantity: number
  symbol: string
  side: 'LONG' | 'SHORT' | 'BOTH'
}

export function useCloseLimitPopoverLogic({ symbol, side, quantity }: Props) {
  const { isTestnetAccount } = useAccountStore()
  const [open, setOpen] = useState(false)
  const { data: lastPrice, isPending: isPendingPrice } =
    trpc.getSymbolPrice.useQuery({ symbol, isTestnetAccount })
  const form = useForm<SingleOrderSchema>({
    resolver: zodResolver(singleOrderSchema),
    defaultValues: {
      symbol,
      price: 0,
      quantity,
      side: side === 'LONG' ? 'SELL' : 'BUY',
      isUsdtQuantity: false,
    },
  })

  const { setValue } = form

  useEffect(() => {
    if (lastPrice) {
      setValue('price', lastPrice)
    }
  }, [open, lastPrice, setValue])

  return { form, open, setOpen, isPendingPrice, setValue }
}
