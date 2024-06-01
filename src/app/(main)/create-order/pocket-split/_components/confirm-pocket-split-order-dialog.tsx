import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { convertPriceToUsdt } from '@/functions/convert-price-to-usdt'
import { getOrderSide } from '@/functions/get-order-side'
import { resolveError } from '@/functions/resolve-error'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { PocketSplitOrderSchema } from '@/schemas/pocket-split-order-schema'
import { trpc } from '@/server/client'
import { toast } from 'sonner'

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setData: React.Dispatch<
    React.SetStateAction<PocketSplitOrderSchema | undefined>
  >
  data?: PocketSplitOrderSchema
}

export function ConfirmPocketSplitOrderDialog({
  open,
  setOpen,
  setData,
  data,
}: Props) {
  const trpcUtils = trpc.useUtils()
  const orderSide = getOrderSide(data ? data.side : 'BUY')
  const { mutateAsync: newOrder, isPending } = trpc.newOrder.useMutation()
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()

  const handleConfirmSplitOrder = async () => {
    if (data) {
      const promises = data.orders.flatMap((order) => {
        return order.prices.flatMap((price, index) => {
          return newOrder({
            api: {
              apiKey,
              secretKey,
              isTestnetAccount,
              type: 'LIMIT',
              data: {
                symbol: order.symbol,
                side: data.side,
                isUsdtQuantity: true,
                quantity: order.sizes[index],
                price,
              },
            },
          })
        })
      })

      try {
        await Promise.all(promises)
        toast.success(
          `Split orders from "${data.pocket.name}" created successfully!`,
        )

        await Promise.all([
          trpcUtils.getOrders.invalidate(),
          trpcUtils.getPositions.invalidate(),
        ])
      } catch (error) {
        resolveError(error, "Couldn't create all orders.")
      }

      setData(undefined)
      setOpen(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!!data && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-slate-50">
              Confirm pocket split order
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              {`You will create ${data.ordersQuantity * data.pocket.symbols.length} orders, ${data.ordersQuantity} for each symbol in the ${data.pocket.name} pocket.`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex h-96 w-full flex-col gap-3 pr-3">
            {/* List (smaller screens) */}
            <div className="flex flex-col gap-2 sm:hidden">
              {data.orders.flatMap((order) => {
                return order.prices.flatMap((price, index) => {
                  return (
                    <div
                      key={index}
                      className="flex w-full items-center justify-between rounded-lg border-2 border-border p-3 text-sm"
                    >
                      <div className="flex flex-col gap-1">
                        <span>{order.symbol}</span>

                        <span className="text-lg font-bold">
                          {`$ ${convertPriceToUsdt(order.sizes[index], price).toFixed(2)}`}
                        </span>

                        <div className="flex items-center gap-1">
                          <span className="font-medium">Side: </span>
                          <span
                            data-long={orderSide === 'LONG'}
                            data-short={orderSide === 'SHORT'}
                            className="data-[long=true]:text-green-700 data-[short=true]:text-red-700 dark:data-[long=true]:text-green-400 dark:data-[short=true]:text-red-400"
                          >
                            {orderSide}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="font-medium">Price: </span>
                          <span>{price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              })}
            </div>

            {/* Table (bigger screens) */}
            <Table
              className="relative hidden rounded-2xl sm:table"
              hasWrapper={false}
            >
              <TableHeader className="sticky top-0 z-10 w-full -translate-y-px bg-slate-800 ">
                <TableRow className="hover:bg-slate-800/50 data-[state=selected]:bg-slate-800">
                  <TableHead className="w-52 text-slate-300">Symbol</TableHead>
                  <TableHead className="w-52 text-slate-300">Side</TableHead>
                  <TableHead className="w-52 text-slate-300">
                    Entry Price
                  </TableHead>
                  <TableHead className="w-52 text-right text-slate-300">
                    Size
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.orders.flatMap((order) => {
                  return order.prices.flatMap((price, index) => {
                    return (
                      <TableRow
                        key={`${order.symbol}.${index}`}
                        className="text-slate-50 hover:bg-slate-800/50 data-[state=selected]:bg-slate-800"
                      >
                        <TableCell className="font-medium">
                          {order.symbol}
                        </TableCell>
                        <TableCell
                          data-long={orderSide === 'LONG'}
                          data-short={orderSide === 'SHORT'}
                          className="data-[long=true]:text-green-400 data-[short=true]:text-red-400"
                        >
                          {orderSide}
                        </TableCell>
                        <TableCell>{price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {`$ ${convertPriceToUsdt(order.sizes[index], price).toFixed(2)}`}
                        </TableCell>
                      </TableRow>
                    )
                  })
                })}
              </TableBody>
              <TableFooter className="sticky -bottom-px z-10 bg-slate-800">
                <TableRow className="hover:bg-slate-800/50 data-[state=selected]:bg-slate-800">
                  <TableCell colSpan={3} className="text-slate-300">
                    Total (USDT)
                  </TableCell>
                  <TableCell className="text-right text-slate-300">
                    <span className="mr-1">$</span>
                    {data.orders
                      .reduce((total, order) => {
                        const orderTotalSize = order.prices.reduce(
                          (total, price, index) =>
                            total +
                            convertPriceToUsdt(order.sizes[index], price),
                          0,
                        )
                        return total + orderTotalSize
                      }, 0)
                      .toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ScrollArea>

          <div className="sm:hidden">
            <span className="font-medium">Total (USDT): </span>
            <span className="mr-1">$</span>
            <span>
              {data.orders
                .reduce((total, order) => {
                  const orderTotalSize = order.prices.reduce(
                    (total, price, index) =>
                      total + convertPriceToUsdt(order.sizes[index], price),
                    0,
                  )
                  return total + orderTotalSize
                }, 0)
                .toFixed(2)}
            </span>
          </div>

          <DialogFooter className="gap-2 pr-3 sm:gap-0">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-slate-800 bg-slate-950 text-slate-50 hover:bg-slate-800 hover:text-slate-50"
              >
                Close
              </Button>
            </DialogClose>

            <Button
              type="button"
              variant="secondary"
              className="flex gap-2 bg-slate-800 text-slate-50 hover:bg-slate-800/80"
              disabled={isPending}
              onClick={handleConfirmSplitOrder}
            >
              {isPending && (
                <Spinner className="size-4 fill-white text-slate-800" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
