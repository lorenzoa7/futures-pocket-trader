'use client'

import { GetPositionResponse, Position } from '@/api/get-positions'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { sides } from '@/config/currency'
import { convertPriceToUsdt } from '@/functions/convert-price-to-usdt'
import { getPositionSide } from '@/functions/get-position-side'
import { mergeObjects } from '@/functions/merge-objects'
import { roundToDecimals } from '@/functions/round-to-decimals'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { cn } from '@/lib/utils'
import { CloseAllLimitSchema } from '@/schemas/close-all-limit-schema'
import {
  InformationFilterSchema,
  informationFilterSchema,
} from '@/schemas/information-filter-schema'
import { SingleOrderSchema } from '@/schemas/single-order-schema'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { TRPCClientError } from '@trpc/client'
import { Check, ChevronsUpDown, RefreshCcw, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  CloseAllLimitPopover,
  SymbolInformation,
} from './close-all-limit-popover'
import { CloseLimitPopover } from './close-limit-popover'

export function PositionsTable() {
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
      if (error instanceof TRPCClientError) {
        const [errorTitle, errorMessage] = error.message.split('|')
        toast.error(errorTitle, {
          description:
            errorMessage && errorMessage.length > 0 ? errorMessage : undefined,
        })
        return
      }

      toast.error("Couldn't create a close market order.")
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

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleFilter)} ref={formRef}>
          <Label>Filters</Label>
          <div className="my-2 flex gap-2.5">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem className="relative flex flex-col">
                  <Popover
                    open={openSymbolFilter}
                    onOpenChange={setOpenSymbolFilter}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'justify-between w-40',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? openPositionsSymbols.find(
                                (symbol) => symbol === field.value,
                              )
                            : 'Select symbol'}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-0">
                      <Command>
                        {isPendingPositions ? (
                          <div className="mx-auto flex items-center gap-2 py-3">
                            <Spinner />
                            <span>Loading currencies...</span>
                          </div>
                        ) : (
                          <>
                            <CommandInput placeholder="Search symbol..." />
                            <CommandEmpty>No symbol found.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                <ScrollArea viewportClassName="max-h-32">
                                  {openPositionsSymbols.map((symbol) => (
                                    <CommandItem
                                      value={symbol}
                                      key={symbol}
                                      onSelect={() => {
                                        form.setValue('symbol', symbol)

                                        if (formRef && formRef.current) {
                                          formRef.current.requestSubmit()
                                        }

                                        setOpenSymbolFilter(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          symbol === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                      {symbol}
                                    </CommandItem>
                                  ))}
                                </ScrollArea>
                              </CommandList>
                            </CommandGroup>
                          </>
                        )}
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-has-filter={!!form.getValues('symbol')}
                    className="invisible absolute -right-2 -top-4 size-6 rounded-full data-[has-filter=true]:visible"
                    onClick={() => {
                      form.setValue('symbol', undefined)

                      if (formRef && formRef.current) {
                        formRef.current.requestSubmit()
                      }
                    }}
                  >
                    <X className="size-4" />
                  </Button>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="side"
              render={({ field }) => (
                <FormItem className="relative flex flex-col">
                  <Popover
                    open={openSideFilter}
                    onOpenChange={setOpenSideFilter}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'justify-between w-40',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? sides.find((side) => side === field.value)
                            : 'Select side'}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {sides.map((side) => (
                              <CommandItem
                                value={side}
                                key={side}
                                onSelect={() => {
                                  form.setValue('side', side)

                                  if (formRef && formRef.current) {
                                    formRef.current.requestSubmit()
                                  }

                                  setOpenSideFilter(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    side === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {side}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    data-has-filter={!!form.getValues('side')}
                    className="invisible absolute -right-2 -top-4 size-6 rounded-full data-[has-filter=true]:visible"
                    onClick={() => {
                      form.setValue('side', undefined)

                      if (formRef && formRef.current) {
                        formRef.current.requestSubmit()
                      }
                    }}
                  >
                    <X className="size-4" />
                  </Button>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-1 justify-end pr-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleRefreshPositions}
              >
                <RefreshCcw
                  className={cn(
                    'size-4',
                    isFetchingPositions && 'animate-spin',
                  )}
                />
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <ScrollArea className="flex h-96 w-full flex-col gap-3 pr-3">
        {isPendingPositions ? (
          <div className="flex w-full items-center justify-center">
            <Spinner className="mt-32 size-10" />
          </div>
        ) : filteredPositions && filteredPositions.length > 0 ? (
          <Table className="relative rounded-2xl" hasWrapper={false}>
            <TableHeader className="sticky top-0 z-10 w-full -translate-y-px bg-slate-200 dark:bg-slate-800">
              <TableRow>
                <TableHead className="w-56">Symbol</TableHead>
                <TableHead className="w-52">Side</TableHead>
                <TableHead className="w-72">Entry Price</TableHead>
                <TableHead className="w-56 text-right">Size</TableHead>
                <TableHead className="w-96 space-x-2 text-center">
                  <span>Close all:</span>
                  <Button
                    type="button"
                    variant="link"
                    disabled={isPendingNewOrder}
                    onClick={handleCloseAll}
                    className="h-4 px-0 text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-500"
                  >
                    {isPendingNewOrder ? <Spinner /> : <span>Market</span>}
                  </Button>

                  <Separator
                    orientation="vertical"
                    className="inline-block h-4"
                  />

                  {isPendingSymbolsPrices ? (
                    <Spinner className="mb-1.5 inline-block size-3" />
                  ) : (
                    <CloseAllLimitPopover
                      symbolsInformation={filteredPositions.map((position) => {
                        const symbolData = symbols?.find(
                          (item) => item.symbol === position.symbol,
                        )

                        const symbolInformation: SymbolInformation = {
                          symbol: position.symbol,
                          quantity: roundToDecimals(
                            Math.abs(Number(position.positionAmt)),
                            symbolData ? symbolData.quantityPrecision : 2,
                          ),
                          quantityPrecision: symbolData
                            ? symbolData.quantityPrecision
                            : 2,
                          side: getPositionSide(Number(position.notional)),
                          price: prices[position.symbol] ?? 0.5,
                        }

                        return symbolInformation
                      })}
                      handleSubmit={handleCloseAllLimit}
                      isPending={isPendingNewOrder || isPendingPositions}
                      open={openCloseAllLimitPopover}
                      setOpen={setOpenCloseAllLimitPopover}
                    />
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPositions
                .sort(
                  (positionA, positionB) =>
                    convertPriceToUsdt(
                      Number(positionB.positionAmt),
                      prices[positionB.symbol] ?? 0,
                    ) -
                    convertPriceToUsdt(
                      Number(positionA.positionAmt),
                      prices[positionA.symbol] ?? 0,
                    ),
                )
                .map((position, index) => {
                  const positionSide = getPositionSide(
                    Number(position.notional),
                  )
                  const symbolData = symbols?.find(
                    (item) => item.symbol === position.symbol,
                  )
                  return (
                    <TableRow key={index}>
                      <TableCell className="flex gap-1.5 font-medium">
                        <span>{position.symbol}</span>
                        <span className="rounded bg-slate-200 px-1 text-yellow-600 dark:bg-slate-800 dark:text-yellow-400">{`${position.leverage}x`}</span>
                      </TableCell>
                      <TableCell
                        data-long={positionSide === 'LONG'}
                        data-short={positionSide === 'SHORT'}
                        className="data-[long=true]:text-green-600 data-[short=true]:text-red-600 dark:data-[long=true]:text-green-400 dark:data-[short=true]:text-red-400"
                      >
                        {positionSide}
                      </TableCell>
                      <TableCell>
                        {Number(position.entryPrice).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {`$ ${convertPriceToUsdt(
                          Number(position.positionAmt),
                          prices[position.symbol] ?? 0,
                        ).toFixed(2)}`}
                      </TableCell>
                      <TableCell className="flex justify-center gap-2 text-center">
                        <Button
                          type="button"
                          variant="link"
                          disabled={isPendingNewOrder}
                          onClick={() => {
                            handleCloseMarket(position)
                          }}
                          className="h-4 px-0 text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-500"
                        >
                          Market
                        </Button>

                        <Separator orientation="vertical" className="h-4" />

                        {symbolData && (
                          <CloseLimitPopover
                            quantity={roundToDecimals(
                              Math.abs(Number(position.positionAmt)),
                              symbolData.quantityPrecision,
                            )}
                            symbol={position.symbol}
                            handleSubmit={handleCloseLimit}
                            side={getPositionSide(Number(position.notional))}
                            isPending={isPendingNewOrder}
                            quantityPrecision={symbolData.quantityPrecision}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
            <TableFooter className="sticky -bottom-px z-10 translate-y-px bg-slate-200 dark:bg-slate-800">
              <TableRow>
                <TableCell colSpan={4}>Total (USDT)</TableCell>
                <TableCell className="text-right">
                  <span className="mr-1">$</span>
                  {isPendingSymbolsPrices
                    ? '...'
                    : filteredPositions
                        .reduce(
                          (total, position) =>
                            total +
                            convertPriceToUsdt(
                              Number(position.positionAmt),
                              prices[position.symbol] ?? 0,
                            ),
                          0,
                        )
                        .toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <div className="text-center">
            <Label>
              There are no open positions or <br />
              no open positions matches your filters.
            </Label>
          </div>
        )}
      </ScrollArea>
    </>
  )
}
