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
import { roundToDecimals } from '@/functions/round-to-decimals'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, RefreshCcw, X } from 'lucide-react'
import { usePositionsLogic } from '../_hooks/use-positions-logic'
import {
  CloseAllLimitPopover,
  SymbolInformation,
} from './close-all-limit-popover'
import { CloseLimitPopover } from './close-limit-popover'

export function PositionsTable() {
  const { apiKey, secretKey } = useAccountStore()
  const {
    handleCloseAll,
    handleCloseAllLimit,
    handleCloseLimit,
    handleCloseMarket,
    isPendingNewOrder,
    isPendingPositions,
    isPendingSymbolsPrices,
    filteredPositions,
    symbols,
    openCloseAllLimitPopover,
    prices,
    setOpenCloseAllLimitPopover,
    form,
    handleFilter,
    handleSubmit,
    formRef,
    openSideFilter,
    openSymbolFilter,
    setOpenSideFilter,
    setOpenSymbolFilter,
    openPositionsSymbols,
    handleRefreshPositions,
    isFetchingPositions,
  } = usePositionsLogic()

  return (
    <>
      {apiKey.length > 0 && secretKey.length > 0 ? (
        <>
          {/* Form  */}
          <Form {...form}>
            <form onSubmit={handleSubmit(handleFilter)} ref={formRef}>
              <div className="flex w-full items-center justify-between">
                <Label>Filters</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full lg:hidden"
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
              <div className="mb-2 mt-0 flex gap-1 lg:my-2 lg:gap-2.5">
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem className="relative flex w-full flex-col lg:w-fit">
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
                                'justify-between lg:w-40 w-full sm:text-sm text-xs',
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
                        <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            {isPendingPositions ? (
                              <div className="mx-auto flex items-center gap-2 py-3">
                                <Spinner />
                                <span className="text-sm">
                                  Loading currencies...
                                </span>
                              </div>
                            ) : (
                              <>
                                <CommandInput
                                  placeholder="Search symbol..."
                                  className="text-xs sm:text-sm"
                                />
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
                    <FormItem className="relative flex w-full flex-col lg:w-fit">
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
                                'justify-between lg:w-40 w-full sm:text-sm text-xs',
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
                        <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
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

                <div className="hidden flex-1 justify-end pr-3 lg:flex">
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

          {/* Content  */}
          <ScrollArea className="mt-4 flex w-full flex-col gap-3 lg:mt-0 lg:h-96 lg:pr-3">
            {isPendingPositions ? (
              <div className="flex w-full items-center justify-center">
                <Spinner className="mt-32 size-10" />
              </div>
            ) : filteredPositions && filteredPositions.length > 0 ? (
              <>
                {/* List (smaller screens) */}
                <div className="flex flex-col gap-2 lg:hidden">
                  <Label>Positions</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="brand"
                      disabled={isPendingNewOrder}
                      onClick={handleCloseAll}
                      className="flex-1"
                    >
                      {isPendingNewOrder ? (
                        <Spinner />
                      ) : (
                        <span>Close all (market)</span>
                      )}
                    </Button>

                    {isPendingSymbolsPrices ? (
                      <Spinner className="mb-1.5 inline-block size-3" />
                    ) : (
                      <CloseAllLimitPopover
                        symbolsInformation={filteredPositions.map(
                          (position) => {
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
                          },
                        )}
                        handleSubmit={handleCloseAllLimit}
                        isPending={isPendingNewOrder || isPendingPositions}
                        open={openCloseAllLimitPopover}
                        setOpen={setOpenCloseAllLimitPopover}
                      />
                    )}
                  </div>
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
                        <div
                          key={index}
                          className="flex w-full items-center justify-between rounded-lg border-2 border-border p-3 text-sm"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span>{position.symbol}</span>
                              <span className="rounded bg-slate-200 px-1 text-yellow-700 dark:bg-slate-800 dark:text-yellow-400">{`${position.leverage}x`}</span>
                            </div>

                            <span className="text-lg font-bold">
                              {`$ ${convertPriceToUsdt(
                                Number(position.positionAmt),
                                prices[position.symbol] ?? 0,
                              ).toFixed(2)}`}
                            </span>

                            <div className="flex items-center gap-1">
                              <span className="font-medium">Side: </span>
                              <span
                                data-long={positionSide === 'LONG'}
                                data-short={positionSide === 'SHORT'}
                                className="data-[long=true]:text-green-700 data-[short=true]:text-red-700 dark:data-[long=true]:text-green-400 dark:data-[short=true]:text-red-400"
                              >
                                {positionSide}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="font-medium">Entry Price: </span>
                              <span>
                                {Number(position.entryPrice).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="flex h-full flex-col gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="brand"
                              disabled={isPendingNewOrder}
                              onClick={() => {
                                handleCloseMarket(position)
                              }}
                              className="text-xs sm:text-sm"
                            >
                              Close market
                            </Button>

                            {symbolData && (
                              <CloseLimitPopover
                                quantity={roundToDecimals(
                                  Math.abs(Number(position.positionAmt)),
                                  symbolData.quantityPrecision,
                                )}
                                symbol={position.symbol}
                                handleSubmit={handleCloseLimit}
                                side={getPositionSide(
                                  Number(position.notional),
                                )}
                                isPending={isPendingNewOrder}
                                quantityPrecision={symbolData.quantityPrecision}
                              />
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>

                {/* Table (bigger screens) */}
                <Table
                  className="relative hidden rounded-2xl lg:table"
                  hasWrapper={false}
                >
                  <TableHeader className="sticky top-0 z-10 w-full -translate-y-px bg-slate-200 dark:bg-slate-800">
                    <TableRow>
                      <TableHead className="w-56">Symbol</TableHead>
                      <TableHead className="w-52">Side</TableHead>
                      <TableHead className="w-72">Entry Price</TableHead>
                      <TableHead className="w-56 text-right">Size</TableHead>
                      <TableHead className="w-96">
                        <div className="flex flex-col gap-0.5 text-center">
                          <span>Close all:</span>
                          <div className="space-x-2">
                            <Button
                              type="button"
                              variant="link"
                              disabled={isPendingNewOrder}
                              onClick={handleCloseAll}
                              className="h-4 px-0 text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-500"
                            >
                              {isPendingNewOrder ? (
                                <Spinner />
                              ) : (
                                <span>Market</span>
                              )}
                            </Button>

                            <Separator
                              orientation="vertical"
                              className="inline-block h-4"
                            />

                            {isPendingSymbolsPrices ? (
                              <Spinner className="mb-1.5 inline-block size-3" />
                            ) : (
                              <CloseAllLimitPopover
                                symbolsInformation={filteredPositions.map(
                                  (position) => {
                                    const symbolData = symbols?.find(
                                      (item) => item.symbol === position.symbol,
                                    )

                                    const symbolInformation: SymbolInformation =
                                      {
                                        symbol: position.symbol,
                                        quantity: roundToDecimals(
                                          Math.abs(
                                            Number(position.positionAmt),
                                          ),
                                          symbolData
                                            ? symbolData.quantityPrecision
                                            : 2,
                                        ),
                                        quantityPrecision: symbolData
                                          ? symbolData.quantityPrecision
                                          : 2,
                                        side: getPositionSide(
                                          Number(position.notional),
                                        ),
                                        price: prices[position.symbol] ?? 0.5,
                                      }

                                    return symbolInformation
                                  },
                                )}
                                handleSubmit={handleCloseAllLimit}
                                isPending={
                                  isPendingNewOrder || isPendingPositions
                                }
                                open={openCloseAllLimitPopover}
                                setOpen={setOpenCloseAllLimitPopover}
                              />
                            )}
                          </div>
                        </div>
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

                              <Separator
                                orientation="vertical"
                                className="h-4"
                              />

                              {symbolData && (
                                <CloseLimitPopover
                                  quantity={roundToDecimals(
                                    Math.abs(Number(position.positionAmt)),
                                    symbolData.quantityPrecision,
                                  )}
                                  symbol={position.symbol}
                                  handleSubmit={handleCloseLimit}
                                  side={getPositionSide(
                                    Number(position.notional),
                                  )}
                                  isPending={isPendingNewOrder}
                                  quantityPrecision={
                                    symbolData.quantityPrecision
                                  }
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
              </>
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
      ) : (
        <SetCredentialsKeysWarning />
      )}
    </>
  )
}
