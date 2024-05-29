'use client'

import { getOrderSide } from '@/functions/get-order-side'
import { useAccountStore } from '@/hooks/store/use-account-store'
import {
  InformationFilterSchema,
  informationFilterSchema,
} from '@/schemas/information-filter-schema'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function useOrdersLogic() {
  const trpcUtils = trpc.useUtils()
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()

  const {
    data: orders,
    isPending: isPendingOrders,
    isFetching: isFetchingOrders,
  } = trpc.getOrders.useQuery(
    { apiKey, secretKey, isTestnetAccount },
    {
      enabled: apiKey.length > 0 && secretKey.length > 0,
    },
  )
  const { mutateAsync: cancelOrder, isPending: isPendingCancelOrder } =
    trpc.cancelOrder.useMutation({
      onSuccess: async (_, variables) => {
        if (variables.shouldRefetch) {
          await trpcUtils.getOrders.invalidate()
        }
      },
    })

  const [filteredOrders, setFilteredOrders] = useState(orders)

  const openOrdersSymbols = orders
    ? [...new Set(orders.map((order) => order.symbol))]
    : []

  const form = useForm<InformationFilterSchema>({
    resolver: zodResolver(informationFilterSchema),
  })
  const { handleSubmit, setValue } = form

  const handleFilter = (data: InformationFilterSchema) => {
    setFilteredOrders((state) => {
      if (!state || !orders) {
        return state
      }

      return orders.filter(
        (order) =>
          (!data.symbol || data.symbol === order.symbol) &&
          (!data.side || data.side === getOrderSide(order.side)),
      )
    })
  }

  const handleCancelCancelAllOrders = async () => {
    if (orders) {
      const promises = orders.map((order) =>
        cancelOrder({
          noErrorMessage: true,
          api: {
            apiKey,
            secretKey,
            isTestnetAccount,
            symbol: order.symbol,
            orderId: order.orderId,
          },
        }),
      )

      try {
        await Promise.all(promises)
        await trpcUtils.getOrders.invalidate()
      } catch (error) {
        toast.error("Couldn't cancel all orders.", {
          description: error as string,
        })
      }
    }
  }

  const formRef = useRef<HTMLFormElement>(null)

  const handleRefreshOrders = () => {
    setValue('symbol', undefined)
    setValue('side', undefined)
    trpcUtils.getOrders.invalidate()
  }

  const [openSymbolFilter, setOpenSymbolFilter] = useState(false)
  const [openSideFilter, setOpenSideFilter] = useState(false)

  useEffect(() => {
    setFilteredOrders(orders)
  }, [orders])

  return {
    handleRefreshOrders,
    form,
    handleSubmit,
    handleFilter,
    openSymbolFilter,
    setOpenSymbolFilter,
    openSideFilter,
    setOpenSideFilter,
    formRef,
    handleCancelCancelAllOrders,
    openOrdersSymbols,
    filteredOrders,
    isPendingCancelOrder,
    isPendingOrders,
    isFetchingOrders,
    cancelOrder,
  }
}
