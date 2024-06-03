import { CloseLimitQuantityPercentages } from '@/config/currency'
import {
  CloseAllLimitSchema,
  closeAllLimitSchema,
} from '@/schemas/close-all-limit-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SymbolInformation } from '../_components/close-all-limit-popover'

type Props = {
  symbolsInformation: SymbolInformation[]
  open: boolean
}

export function useCloseLimitAllPopoverLogic({
  symbolsInformation,
  open,
}: Props) {
  const [selectedPercentage, setSelectedPercentage] =
    useState<CloseLimitQuantityPercentages>(100)

  const form = useForm<CloseAllLimitSchema>({
    resolver: zodResolver(closeAllLimitSchema),
    defaultValues: {
      orders: symbolsInformation.map((data) => ({
        symbol: data.symbol,
        price: data.price,
        quantity: data.quantity,
        side: data.side === 'LONG' ? 'SELL' : 'BUY',
        isUsdtQuantity: false,
      })),
    },
  })

  const { setValue } = form

  useEffect(() => {
    setSelectedPercentage(100)
  }, [open])

  return {
    form,
    selectedPercentage,
    setSelectedPercentage,
    setValue,
  }
}
