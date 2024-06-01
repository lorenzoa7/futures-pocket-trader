'use client'

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
import { Slider } from '@/components/ui/slider'
import Spinner from '@/components/ui/spinner'
import { convertUsdtToPrice } from '@/functions/convert-usdt-to-price'
import { mergeObjects } from '@/functions/merge-objects'
import { roundToDecimals } from '@/functions/round-to-decimals'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { cn } from '@/lib/utils'
import {
  PocketSplitOrderSchema,
  pocketSplitOrderSchema,
} from '@/schemas/pocket-split-order-schema'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ConfirmPocketSplitOrderDialog } from './confirm-pocket-split-order-dialog'

export function CreatePocketSplitOrderForm() {
  const { apiKey, secretKey, isTestnetAccount, pockets } = useAccountStore()

  const form = useForm<PocketSplitOrderSchema>({
    resolver: zodResolver(pocketSplitOrderSchema),
    defaultValues: {
      pocket: {
        id: '',
        name: '',
        symbols: [],
      },
      size: 500,
      side: 'BUY',
      ordersQuantity: 5,
      dropPercentage: 30,
      orders: [],
    },
  })

  const {
    watch,
    setValue,
    formState: { isSubmitting },
  } = form

  const side = watch('side')
  const selectedPocket = watch('pocket')
  const [open, setOpen] = useState(false)

  const { data: symbols, isPending: isPendingSymbols } =
    trpc.getSymbols.useQuery({ isTestnetAccount })

  const symbolsPricesQueries = trpc.useQueries((t) =>
    selectedPocket.symbols.map((symbol) =>
      t.getSymbolPrice(
        { symbol, isTestnetAccount },
        {
          enabled: selectedPocket.symbols.length > 0,
          select: (data: number | undefined) => {
            return { [symbol]: data }
          },
        },
      ),
    ),
  )

  const pocketLastPrices = mergeObjects(
    ...symbolsPricesQueries.map((result) => result.data ?? {}),
  )

  const isPendingLastPocketPrices = symbolsPricesQueries.some(
    (result) => result.isPending,
  )

  const [data, setData] = useState<PocketSplitOrderSchema>()
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false)

  async function handleCreateSplitOrder(data: PocketSplitOrderSchema) {
    const { pocket, dropPercentage, ordersQuantity, size } = data
    if (pocket.symbols.length === 0) {
      toast.error('There are no symbols (or currencies) in this pocket!')
      return
    }

    const splitOrders: PocketSplitOrderSchema['orders'] =
      pocket.symbols.flatMap((symbol) => {
        const selectedSymbolData = symbols?.find(
          (symbolData) => symbolData.symbol === symbol,
        )

        const precision = selectedSymbolData && {
          quantity: selectedSymbolData.quantityPrecision,
          price: selectedSymbolData.pricePrecision,
          baseAsset: selectedSymbolData.baseAssetPrecision,
          quote: selectedSymbolData.quotePrecision,
        }

        if (!precision) {
          toast.error(
            `Something went wrong with ${symbol}'s precision. Check the parameters and try again!`,
          )
          return []
        }

        const lastPrice = pocketLastPrices[symbol]

        if (!lastPrice) {
          toast.error(
            `Could't fetch ${symbol}'s last price. Check the parameters and try again!`,
          )
          return []
        }

        const basePrice = roundToDecimals(lastPrice, precision.price || 0)

        const prices = Array.from({ length: ordersQuantity }).map(
          (_, index) => {
            const price =
              (1 - (dropPercentage / ordersQuantity / 100) * (index + 1)) *
              basePrice

            const correctedPrice =
              price - (price % Number(selectedSymbolData.filters[0].tickSize))
            return roundToDecimals(correctedPrice, precision.price)
          },
        )

        const sizes = prices.map((price) =>
          roundToDecimals(
            convertUsdtToPrice(size, price),
            precision.quantity || 0,
          ),
        )

        if (prices.some((price) => price <= 0)) {
          toast.error(
            `Price is too low on ${symbol}. Set a new price and try again.`,
          )
          return []
        }

        if (sizes.some((size) => size <= 0)) {
          toast.error(
            `Size is too low on ${symbol}. Set a new size and try again.`,
          )
          return []
        }

        return {
          symbol,
          prices,
          sizes,
        }
      })

    if (splitOrders.length > 0) {
      setData({ ...data, orders: splitOrders })
      setOpenConfirmationDialog(true)
    }
  }

  return (
    <>
      {apiKey.length > 0 && secretKey.length > 0 ? (
        <>
          <ConfirmPocketSplitOrderDialog
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
                name="pocket"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Pocket</FormLabel>

                    <Popover open={open} onOpenChange={setOpen}>
                      <div className="flex gap-2">
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'justify-between w-full truncate',
                                !field.value.id && 'text-muted-foreground',
                              )}
                            >
                              {field.value.id
                                ? pockets?.find(
                                    (pocket) => pocket.id === field.value.id,
                                  )?.name
                                : 'Select pocket'}
                              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                      </div>
                      <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search symbol..." />
                          <CommandEmpty>No pocket found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList className="max-h-32">
                              {pockets?.map((pocket) => (
                                <CommandItem
                                  value={pocket.name}
                                  key={pocket.id}
                                  onSelect={() => {
                                    form.setValue('pocket', pocket)
                                    setOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      pocket.id === field.value.id
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {pocket.name}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (for each symbol)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="[&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </FormControl>
                      <div className="h-10 rounded-md border border-input px-3 py-2 text-sm font-medium uppercase">
                        USDT
                      </div>
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
                    <FormLabel>Orders quantity (for each symbol)</FormLabel>
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
                  disabled={
                    isSubmitting ||
                    isPendingSymbols ||
                    isPendingLastPocketPrices
                  }
                >
                  {isSubmitting && side === 'BUY' && <Spinner />}
                  Buy/Long
                </Button>
                <Button
                  variant="secondary"
                  type="submit"
                  className="flex w-full items-center gap-2 bg-red-300 hover:bg-red-300/80 dark:bg-red-800 dark:hover:bg-red-800/80"
                  onClick={() => setValue('side', 'SELL')}
                  disabled={
                    isSubmitting ||
                    isPendingSymbols ||
                    isPendingLastPocketPrices
                  }
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
