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
import { SplitOrderSchema } from '@/schemas/split-order-schema'
import { trpc } from '@/server/client'
import { toast } from 'sonner'

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setData: React.Dispatch<React.SetStateAction<SplitOrderSchema | undefined>>
  data?: SplitOrderSchema
}

export function ConfirmSplitOrderDialog({
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
      const promises = data.prices.map((price, index) => {
        return newOrder({
          api: {
            apiKey,
            secretKey,
            isTestnetAccount,
            type: 'LIMIT',
            data: {
              symbol: data.symbol,
              side: data.side,
              isUsdtQuantity: data.isUsdtQuantity,
              quantity: data.sizes[index],
              price,
            },
          },
        })
      })

      try {
        await Promise.all(promises)
        toast.success('Split orders created successfully!')

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
            <DialogTitle>Confirm split order</DialogTitle>
            <DialogDescription>
              {`You are going to create ${data.ordersQuantity} ${data.symbol} orders.`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex h-96 w-full flex-col gap-3 pr-3">
            {/* List (smaller screens) */}
            <div className="flex flex-col gap-2 sm:hidden">
              {data.prices.map((price, index) => (
                <div
                  key={index}
                  className="flex w-full items-center justify-between rounded-lg border-2 border-border p-3 text-sm"
                >
                  <div className="flex flex-col gap-1">
                    <span>{data.symbol}</span>

                    <span className="text-lg font-bold">
                      {`$ ${convertPriceToUsdt(data.sizes[index], price).toFixed(2)}`}
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
                      <span className="font-medium">Entry Price: </span>
                      <span>{price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table (bigger screens) */}
            <Table
              className="relative hidden rounded-2xl sm:table"
              hasWrapper={false}
            >
              <TableHeader className="sticky top-0 z-10 w-full -translate-y-px bg-slate-200 dark:bg-slate-800">
                <TableRow>
                  <TableHead className="w-52">Symbol</TableHead>
                  <TableHead className="w-52">Side</TableHead>
                  <TableHead className="w-52">Entry Price</TableHead>
                  <TableHead className="w-52 text-right">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.prices.map((price, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{data.symbol}</TableCell>
                    <TableCell
                      data-long={orderSide === 'LONG'}
                      data-short={orderSide === 'SHORT'}
                      className="data-[long=true]:text-green-600 data-[short=true]:text-red-600 dark:data-[long=true]:text-green-400 dark:data-[short=true]:text-red-400"
                    >
                      {orderSide}
                    </TableCell>
                    <TableCell>{price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {`$ ${convertPriceToUsdt(data.sizes[index], price).toFixed(2)}`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="sticky -bottom-px z-10 bg-slate-200 dark:bg-slate-800">
                <TableRow>
                  <TableCell colSpan={3}>Total (USDT)</TableCell>
                  <TableCell className="text-right">
                    <span className="mr-1">$</span>
                    {data.prices
                      .reduce(
                        (total, price, index) =>
                          total + convertPriceToUsdt(data.sizes[index], price),
                        0,
                      )
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
              {data.prices
                .reduce(
                  (total, price, index) =>
                    total + convertPriceToUsdt(data.sizes[index], price),
                  0,
                )
                .toFixed(2)}
            </span>
          </div>

          <DialogFooter className="gap-2 pr-3 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>

            <Button
              type="button"
              variant="default"
              className="flex gap-2"
              disabled={isPending}
              onClick={handleConfirmSplitOrder}
            >
              {isPending && <Spinner className="size-4" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
