import { Button, buttonVariants } from '@/components/ui/button'
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
import Spinner from '@/components/ui/spinner'
import { closeLimitQuantityPercentages } from '@/config/currency'
import { roundToDecimals } from '@/functions/round-to-decimals'
import { stopPropagate } from '@/functions/stop-propagate'
import { SingleOrderSchema } from '@/schemas/single-order-schema'
import { VariantProps } from 'class-variance-authority'
import { useCloseLimitPopoverLogic } from '../_hooks/use-close-limit-popover-logic'

type Props = {
  triggerVariants: VariantProps<typeof buttonVariants>
  triggerClassname: string
  quantity: number
  symbol: string
  side: 'LONG' | 'SHORT' | 'BOTH'
  isPending: boolean
  quantityPrecision: number
  handleSubmit: (data: SingleOrderSchema) => Promise<void>
  triggerText?: string
}

export function CloseLimitPopover({
  triggerClassname,
  triggerText = 'Limit',
  triggerVariants,
  quantity,
  symbol,
  side,
  isPending,
  quantityPrecision,
  handleSubmit,
}: Props) {
  const { form, isPendingPrice, open, setOpen, setValue } =
    useCloseLimitPopoverLogic({
      quantity,
      side,
      symbol,
    })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          disabled={isPending || isPendingPrice}
          className={triggerClassname}
          {...triggerVariants}
        >
          {triggerText}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={stopPropagate(form.handleSubmit(handleSubmit))}
            className="space-y-2"
          >
            <div className="mb-3 space-y-2">
              <h4 className="font-medium leading-none">Limit</h4>
              <p className="text-sm text-muted-foreground">
                Close {symbol} position at limit price.
              </p>
            </div>

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
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <div className="flex flex-col gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="[&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </FormControl>
                    <div className="flex items-center gap-1">
                      {closeLimitQuantityPercentages.map((percentage) => (
                        <Button
                          key={percentage}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-12 px-2 text-sm"
                          onClick={() => {
                            setValue(
                              'quantity',
                              roundToDecimals(
                                quantity * (percentage / 100),
                                quantityPrecision,
                              ),
                            )
                          }}
                          disabled={isPending || isPendingPrice}
                        >
                          {percentage}%
                        </Button>
                      ))}
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex w-32 items-center gap-2"
              variant="outline"
              disabled={isPending || isPendingPrice}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {isPending && <Spinner />}
              Confirm
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
