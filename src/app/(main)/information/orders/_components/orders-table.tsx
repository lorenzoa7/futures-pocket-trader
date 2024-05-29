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
import { getOrderSide } from '@/functions/get-order-side'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, RefreshCcw, Trash2, X } from 'lucide-react'
import { useOrdersLogic } from '../_hooks/use-orders-logic'

export function OrdersTable() {
  const { apiKey, secretKey, isTestnetAccount } = useAccountStore()
  const {
    filteredOrders,
    form,
    formRef,
    handleCancelCancelAllOrders,
    handleFilter,
    handleRefreshOrders,
    handleSubmit,
    isFetchingOrders,
    isPendingCancelOrder,
    isPendingOrders,
    openOrdersSymbols,
    openSideFilter,
    openSymbolFilter,
    setOpenSideFilter,
    setOpenSymbolFilter,
    cancelOrder,
  } = useOrdersLogic()

  return (
    <>
      {apiKey.length > 0 && secretKey.length > 0 ? (
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
                                ? openOrdersSymbols.find(
                                    (symbol) => symbol === field.value,
                                  )
                                : 'Select symbol'}
                              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-0">
                          <Command>
                            {isPendingOrders ? (
                              <div className="mx-auto flex items-center gap-2 py-3">
                                <Spinner />
                                <span className="text-sm">
                                  Loading currencies...
                                </span>
                              </div>
                            ) : (
                              <>
                                <CommandInput placeholder="Search symbol..." />
                                <CommandEmpty>No symbol found.</CommandEmpty>
                                <CommandGroup>
                                  <CommandList>
                                    <ScrollArea viewportClassName="max-h-32">
                                      {openOrdersSymbols.map((symbol) => (
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
                            <CommandGroup>
                              <CommandList>
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
                              </CommandList>
                            </CommandGroup>
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
                    onClick={handleRefreshOrders}
                  >
                    <RefreshCcw
                      className={cn(
                        'size-4',
                        isFetchingOrders && 'animate-spin',
                      )}
                    />
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          <ScrollArea className="flex h-96 w-full flex-col gap-3 pr-3">
            {isPendingOrders ? (
              <div className="flex w-full items-center justify-center">
                <Spinner className="mt-32 size-10" />
              </div>
            ) : filteredOrders && filteredOrders.length > 0 ? (
              <Table className="relative rounded-2xl" hasWrapper={false}>
                <TableHeader className="sticky top-0 z-10 w-full bg-slate-200 dark:bg-slate-800">
                  <TableRow>
                    <TableHead className="w-52">Symbol</TableHead>
                    <TableHead className="w-52">Side</TableHead>
                    <TableHead className="w-52">Price</TableHead>
                    <TableHead className="w-52 text-right">Amount</TableHead>
                    <TableHead className="w-56 text-center">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="px-0 text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-500"
                        onClick={handleCancelCancelAllOrders}
                      >
                        {isPendingCancelOrder ? (
                          <Spinner />
                        ) : (
                          <span>Cancel all</span>
                        )}
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders
                    .sort(
                      (orderA, orderB) =>
                        Number(orderB.price) * Number(orderB.origQty) -
                        Number(orderA.price) * Number(orderA.origQty),
                    )
                    .map((order, index) => {
                      const orderSide = getOrderSide(order.side)
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {order.symbol}
                          </TableCell>
                          <TableCell
                            data-long={orderSide === 'LONG'}
                            data-short={orderSide === 'SHORT'}
                            className="data-[long=true]:text-green-600 data-[short=true]:text-red-600 dark:data-[long=true]:text-green-400 dark:data-[short=true]:text-red-400"
                          >
                            {orderSide}
                          </TableCell>
                          <TableCell>
                            {Number(order.price).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            {`$ ${convertPriceToUsdt(Number(order.price), Number(order.origQty)).toFixed(2)}`}
                          </TableCell>
                          <TableCell className="flex justify-center text-center">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="size-4"
                              disabled={isPendingCancelOrder}
                              onClick={() => {
                                cancelOrder({
                                  shouldRefetch: true,
                                  api: {
                                    apiKey,
                                    secretKey,
                                    isTestnetAccount,
                                    symbol: order.symbol,
                                    orderId: order.orderId,
                                  },
                                })
                              }}
                            >
                              {isPendingCancelOrder ? (
                                <Spinner className="size-4" />
                              ) : (
                                <Trash2 className="size-4 text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-50" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
                <TableFooter className="sticky -bottom-px z-10 bg-slate-200 dark:bg-slate-800">
                  <TableRow>
                    <TableCell colSpan={4}>Total (USDT)</TableCell>
                    <TableCell className="text-right">
                      <span className="mr-1">$</span>
                      {filteredOrders
                        .reduce(
                          (total, order) =>
                            total + Number(order.origQty) * Number(order.price),
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
                  There are no open orders or <br />
                  no open orders matches your filters.
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
