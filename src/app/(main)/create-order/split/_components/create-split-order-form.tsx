'use client'

import { LeveragePopover } from '@/app/(main)/create-order/_components/leverage-popover'
import { MarginTypePopover } from '@/app/(main)/create-order/_components/margin-type-popover'
import { SetCredentialsKeysWarning } from '@/components/core/set-credentials-keys-warning'
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
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import Spinner from '@/components/ui/spinner'
import { convertUsdtToPrice } from '@/functions/convert-usdt-to-price'
import { roundToDecimals } from '@/functions/round-to-decimals'
import { splitSymbolByUSDT } from '@/functions/split-symbol-by-usdt'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { cn } from '@/lib/utils'
import {
  SplitOrderSchema,
  splitOrderSchema,
} from '@/schemas/split-order-schema'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ConfirmSplitOrderDialog } from './confirm-split-order-dialog'

export function CreateSplitOrderForm() {
  const { apiKey, secretKey, isTestnetAccount } = useAccountStore()

  const form = useForm<SplitOrderSchema>({
    resolver: zodResolver(splitOrderSchema),
    defaultValues: {
      symbol: '',
      price: 0,
      size: 0,
      side: 'BUY',
      isUsdtQuantity: false,
      ordersQuantity: 2,
      dropPercentage: 10,
      prices: [],
      sizes: [],
    },
  })

  const {
    watch,
    setValue,
    formState: { isSubmitting },
  } = form

  const symbolWatch = watch('symbol')
  const isUsdtQuantity = watch('isUsdtQuantity')
  const side = watch('side')
  const [currencies, setCurrencies] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const { data: symbols, isPending: isPendingSymbols } =
    trpc.getSymbols.useQuery({ isTestnetAccount })
  const { data: lastPrice, isFetching: isFetchingPrice } =
    trpc.getSymbolPrice.useQuery(
      { symbol: symbolWatch, isTestnetAccount },
      { enabled: symbolWatch.length > 0 },
    )
  const [data, setData] = useState<SplitOrderSchema>()
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false)

  async function handleCreateSplitOrder(data: SplitOrderSchema) {
    const selectedSymbolData = symbols?.find(
      (symbol) => symbol.symbol === data.symbol,
    )

    const precision = selectedSymbolData && {
      quantity: selectedSymbolData.quantityPrecision,
      price: selectedSymbolData.pricePrecision,
      baseAsset: selectedSymbolData.baseAssetPrecision,
      quote: selectedSymbolData.quotePrecision,
    }

    if (!precision) {
      toast.error('Something went wrong. Check the parameters and try again!')
      return
    }

    data.price = roundToDecimals(data.price, precision.price || 0)

    data.prices = Array.from({ length: data.ordersQuantity }).map(
      (_, index) => {
        const price =
          (1 -
            (data.dropPercentage / data.ordersQuantity / 100) * (index + 1)) *
          data.price

        const correctedPrice =
          price - (price % Number(selectedSymbolData.filters[0].tickSize))
        return roundToDecimals(correctedPrice, precision.price)
      },
    )

    data.sizes = data.prices.map((price) =>
      data.isUsdtQuantity
        ? roundToDecimals(
            convertUsdtToPrice(data.size, price),
            precision.quantity || 0,
          )
        : roundToDecimals(data.size, precision.quantity || 0),
    )

    if (data.prices.some((price) => price <= 0)) {
      toast.error('Price is too low. Set a new price and try again.')
      return
    }

    if (data.sizes.some((size) => size <= 0)) {
      toast.error('Size is too low. Set a new size and try again.')
      return
    }

    setData(data)
    setOpenConfirmationDialog(true)
  }

  useEffect(() => {
    if (lastPrice) {
      setValue('price', lastPrice)
    }

    if (symbolWatch && symbolWatch.length > 0) {
      setCurrencies(splitSymbolByUSDT(symbolWatch))
    }
  }, [lastPrice, setValue, symbolWatch])

  return (
    <>
      {apiKey.length > 0 && secretKey.length > 0 ? (
        <>
          <ConfirmSplitOrderDialog
            open={openConfirmationDialog}
            setOpen={setOpenConfirmationDialog}
            setData={setData}
            data={data}
          />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateSplitOrder)}
              className="flex w-full flex-col gap-3 lg:w-1/2 xl:w-72"
            >
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Symbol</FormLabel>

                    <Popover open={open} onOpenChange={setOpen}>
                      <div className="flex gap-2">
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'justify-between w-full truncate',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value
                                ? symbols?.find(
                                    (symbol) => symbol.symbol === field.value,
                                  )?.symbol
                                : 'Select symbol'}
                              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        {symbolWatch && symbolWatch.length > 0 && (
                          <>
                            <LeveragePopover symbol={symbolWatch} />
                            <MarginTypePopover symbol={symbolWatch} />
                          </>
                        )}
                      </div>
                      <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          {isPendingSymbols ? (
                            <div className="mx-auto flex items-center gap-2 py-3">
                              <Spinner />
                              <span>Loading currencies...</span>
                            </div>
                          ) : (
                            <>
                              <CommandInput placeholder="Search symbol..." />
                              <CommandEmpty>No symbol found.</CommandEmpty>
                              <CommandGroup>
                                <CommandList className="max-h-32">
                                  {symbols?.map((symbol) => (
                                    <CommandItem
                                      value={symbol.symbol}
                                      key={symbol.symbol}
                                      onSelect={() => {
                                        form.setValue('symbol', symbol.symbol)
                                        setOpen(false)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          symbol.symbol === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                        )}
                                      />
                                      {symbol.symbol}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </>
                          )}
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          {...field}
                          className="[&::-webkit-inner-spin-button]:appearance-none"
                        />
                        {isFetchingPrice ? (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Spinner />
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-slate-200 px-2 py-px text-sm font-medium duration-150 hover:bg-slate-200/50 dark:bg-slate-900 dark:hover:bg-slate-900/50"
                            onClick={() => {
                              if (lastPrice) {
                                setValue('price', lastPrice)
                              }
                            }}
                          >
                            Last
                          </button>
                        )}
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="[&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </FormControl>
                      {currencies.length > 0 && (
                        <Select
                          value={isUsdtQuantity ? currencies[1] : currencies[0]}
                          onValueChange={(value) => {
                            setValue('isUsdtQuantity', value === 'USDT')
                          }}
                        >
                          <SelectTrigger className="w-48 truncate">
                            <SelectValue placeholder="Select a currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ordersQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orders quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="[&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dropPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drop percentage - {field.value}%</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={99}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => {
                          field.onChange(vals[0])
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-2 flex gap-2">
                <Button
                  variant="secondary"
                  type="submit"
                  className="flex w-full items-center gap-2 bg-green-300 hover:bg-green-300/80 dark:bg-green-800 dark:hover:bg-green-800/80"
                  onClick={() => setValue('side', 'BUY')}
                  disabled={isSubmitting}
                >
                  {isSubmitting && side === 'BUY' && <Spinner />}
                  Buy/Long
                </Button>
                <Button
                  variant="secondary"
                  type="submit"
                  className="flex w-full items-center gap-2 bg-red-300 hover:bg-red-300/80 dark:bg-red-800 dark:hover:bg-red-800/80"
                  onClick={() => setValue('side', 'SELL')}
                  disabled={isSubmitting}
                >
                  {isSubmitting && side === 'SELL' && <Spinner />}
                  Sell/Short
                </Button>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <SetCredentialsKeysWarning />
      )}
    </>
  )
}
