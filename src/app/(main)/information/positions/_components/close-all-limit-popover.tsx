import { Button, buttonVariants } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Spinner from '@/components/ui/spinner'

import { closeLimitQuantityPercentages } from '@/config/currency'
import { roundToDecimals } from '@/functions/round-to-decimals'
import { stopPropagate } from '@/functions/stop-propagate'
import { CloseAllLimitSchema } from '@/schemas/close-all-limit-schema'
import { VariantProps } from 'class-variance-authority'
import { useCloseLimitAllPopoverLogic } from '../_hooks/use-close-all-limit-popover-logic'

export type SymbolInformation = {
  quantity: number
  symbol: string
  side: 'LONG' | 'SHORT' | 'BOTH'
  price: number
  quantityPrecision: number
}

type Props = {
  triggerVariants: VariantProps<typeof buttonVariants>
  triggerClassname: string
  symbolsInformation: SymbolInformation[]
  isPending: boolean
  handleSubmit: (data: CloseAllLimitSchema) => Promise<void>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  triggerText?: string
}

export function CloseAllLimitPopover({
  triggerClassname,
  triggerVariants,
  triggerText = 'Limit',
  symbolsInformation,
  isPending,
  handleSubmit,
  open,
  setOpen,
}: Props) {
  const { form, selectedPercentage, setSelectedPercentage, setValue } =
    useCloseLimitAllPopoverLogic({ open, symbolsInformation })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          disabled={isPending}
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
                Close all positions at limit price.
              </p>
            </div>

            <div className="flex items-center gap-1">
              {closeLimitQuantityPercentages.map((percentage) => (
                <Button
                  key={percentage}
                  type="button"
                  variant="outline"
                  size="sm"
                  data-selected={selectedPercentage === percentage}
                  className="w-12 px-2 text-sm data-[selected=true]:bg-slate-200 dark:data-[selected=true]:bg-slate-800"
                  onClick={() => {
                    setSelectedPercentage(percentage)
                    symbolsInformation.forEach((symbolInformation, index) => {
                      setValue(
                        `orders.${index}.quantity`,
                        roundToDecimals(
                          symbolInformation.quantity * (percentage / 100),
                          symbolInformation.quantityPrecision,
                        ),
                      )
                    })
                  }}
                  disabled={isPending}
                >
                  {percentage}%
                </Button>
              ))}
            </div>

            <Button
              type="submit"
              className="flex w-32 items-center gap-2"
              variant="outline"
              disabled={isPending}
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
