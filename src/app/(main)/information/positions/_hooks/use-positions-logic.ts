'use client'

import { GetPositionResponse, Position } from '@/api/get-positions'
import { getPositionSide } from '@/functions/get-position-side'
import { mergeObjects } from '@/functions/merge-objects'
import { resolveError } from '@/functions/resolve-error'
import { roundToDecimals } from '@/functions/round-to-decimals'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { CloseAllLimitSchema } from '@/schemas/close-all-limit-schema'
import {
  InformationFilterSchema,
  informationFilterSchema,
} from '@/schemas/information-filter-schema'
import { SingleOrderSchema } from '@/schemas/single-order-schema'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function usePositionsLogic() {
  const trpcUtils = trpc.useUtils()
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()
  const {
    data: positions,
    isPending: isPendingPositions,
    isFetching: isFetchingPositions,
  } = trpc.getPositions.useQuery(
    { apiKey, secretKey, isTestnetAccount },
    {
      enabled: apiKey.length > 0 && secretKey.length > 0,
      select: (data: GetPositionResponse | undefined) => {
        return data?.filter((position) => Number(position.entryPrice) > 0)
      },
    },
  )

  const { data: symbols } = trpc.getSymbols.useQuery({ isTestnetAccount })

  const { mutateAsync: newOrder, isPending: isPendingNewOrder } =
    trpc.newOrder.useMutation({
      onSuccess: async (_, variables) => {
        if (variables.shouldRefetch) {
          await Promise.all([
            // TODO: invalidate get orders
            trpcUtils.getPositions.invalidate(),
          ])
        }
      },
    })

  const [filter, setFilter] = useState<InformationFilterSchema>({
    side: undefined,
    symbol: undefined,
  })
  const [openCloseAllLimitPopover, setOpenCloseAllLimitPopover] =
    useState(false)

  const filteredPositions = positions?.filter(
    (position) =>
      (!filter.symbol || filter.symbol === position.symbol) &&
      (!filter.side ||
        filter.side === getPositionSide(Number(position.notional))),
  )

  const positionSymbols = filteredPositions
    ? [...new Set(filteredPositions.map((position) => position.symbol))]
    : []

  const symbolsPricesQueries = trpc.useQueries((t) =>
    positionSymbols.map((symbol) =>
      t.getSymbolPrice(
        { symbol, isTestnetAccount },
        {
          enabled: positionSymbols.length > 0,
          select: (data: number | undefined) => {
            return { [symbol]: data }
          },
        },
      ),
    ),
  )

  const prices = mergeObjects(
    ...symbolsPricesQueries.map((result) => result.data ?? {}),
  )
  const isPendingSymbolsPrices = symbolsPricesQueries.some(
    (result) => result.isPending,
  )

  const openPositionsSymbols = positions
    ? positions.map((position) => position.symbol)
    : []

  const form = useForm<InformationFilterSchema>({
    resolver: zodResolver(informationFilterSchema),
  })
  const { handleSubmit, setValue } = form

  const handleFilter = (data: InformationFilterSchema) => {
    setFilter(data)
  }

  const handleCloseAll = async () => {
    const dataList: Omit<SingleOrderSchema, 'price'>[] =
      positions?.map((position) => ({
        symbol: position.symbol,
        isUsdtQuantity: false,
        quantity: Math.abs(Number(position.positionAmt)),
        side:
          getPositionSide(Number(position.notional)) === 'LONG'
            ? 'SELL'
            : 'BUY',
      })) ?? []

    const promises = dataList.map((data) =>
      newOrder({
        noErrorMessage: true,
        api: {
          apiKey,
          isTestnetAccount,
          secretKey,
          type: 'MARKET',
          data,
        },
      }),
    )

    try {
      await Promise.all(promises)

      await Promise.all([
        // TODO: invalidate get orders
        trpcUtils.getPositions.invalidate(),
      ])

      toast.success('Close market order created successfully!')
    } catch (error) {
      toast.error("Couldn't create a close market order.", {
        description: error as string,
      })
    }
  }

  const handleCloseMarket = async (position: Position) => {
    const data: Omit<SingleOrderSchema, 'price'> = {
      symbol: position.symbol,
      isUsdtQuantity: false,
      quantity: Math.abs(Number(position.positionAmt)),
      side:
        getPositionSide(Number(position.notional)) === 'LONG' ? 'SELL' : 'BUY',
    }

    try {
      await newOrder({
        shouldRefetch: true,
        api: {
          apiKey,
          isTestnetAccount,
          secretKey,
          type: 'MARKET',
          data,
        },
      })

      toast.success('Close market order created successfully!')
    } catch (error) {
      resolveError(error, "Couldn't create a close market order.")
    }
  }

  const handleCloseLimit = async (data: SingleOrderSchema) => {
    const symbolData = symbols?.find((item) => item.symbol === data.symbol)
    const precision = symbolData && {
      quantity: symbolData.quantityPrecision,
      price: symbolData.pricePrecision,
      baseAsset: symbolData.baseAssetPrecision,
      quote: symbolData.quotePrecision,
    }

    data.quantity = roundToDecimals(data.quantity, precision?.quantity || 0)
    data.price = roundToDecimals(data.price, precision?.price || 0)

    try {
      await newOrder({
        noErrorMessage: true,
        shouldRefetch: true,
        api: {
          apiKey,
          isTestnetAccount,
          secretKey,
          type: 'LIMIT',
          data,
        },
      })
      toast.success('Close limit order created successfully!')
    } catch (error) {
      toast.error("Couldn't create a close limit order.", {
        description: error as string,
      })
    }
  }

  const handleCloseAllLimit = async ({ orders }: CloseAllLimitSchema) => {
    const promises = orders.map(async (data) => {
      const symbolData = symbols?.find((item) => item.symbol === data.symbol)
      const precision = symbolData && {
        quantity: symbolData.quantityPrecision,
        price: symbolData.pricePrecision,
        baseAsset: symbolData.baseAssetPrecision,
        quote: symbolData.quotePrecision,
      }

      if (!precision) {
        toast.error('Something went wrong. Check the parameters and try again!')
        return
      }

      data.quantity = roundToDecimals(data.quantity, precision.quantity)

      const correctedPrice =
        data.price - (data.price % Number(symbolData.filters[0].tickSize))
      data.price = roundToDecimals(correctedPrice, precision.price)

      return newOrder({
        noErrorMessage: true,
        api: {
          apiKey,
          isTestnetAccount,
          secretKey,
          type: 'LIMIT',
          data,
        },
      })
    })

    try {
      await Promise.all(promises)
      await Promise.all([
        // TODO: invalidate get orders
        trpcUtils.getPositions.invalidate(),
      ])

      setOpenCloseAllLimitPopover(false)
      toast.success('Close all limit orders created successfully!')
    } catch (error) {
      setOpenCloseAllLimitPopover(false)
      toast.error("Couldn't create a new order.", {
        description: error as string,
      })
    }
  }

  const handleRefreshPositions = () => {
    setValue('symbol', undefined)
    setValue('side', undefined)
    trpcUtils.getPositions.invalidate()
  }

  const formRef = useRef<HTMLFormElement>(null)
  const [openSymbolFilter, setOpenSymbolFilter] = useState(false)
  const [openSideFilter, setOpenSideFilter] = useState(false)

  return {
    form,
    handleSubmit,
    handleFilter,
    handleCloseAll,
    handleCloseLimit,
    handleCloseMarket,
    handleCloseAllLimit,
    formRef,
    openSymbolFilter,
    setOpenSymbolFilter,
    openSideFilter,
    setOpenSideFilter,
    isPendingNewOrder,
    isPendingPositions,
    isPendingSymbolsPrices,
    filteredPositions,
    symbols,
    prices,
    openCloseAllLimitPopover,
    setOpenCloseAllLimitPopover,
    openPositionsSymbols,
    handleRefreshPositions,
    isFetchingPositions,
  }
}
