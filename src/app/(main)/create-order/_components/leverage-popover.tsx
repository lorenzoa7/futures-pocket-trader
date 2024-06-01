import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import Spinner from '@/components/ui/spinner'
import { resolveError } from '@/functions/resolve-error'
import { stopPropagate } from '@/functions/stop-propagate'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { LeverageSchema, leverageSchema } from '@/schemas/leverage-schema'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {
  symbol: string
}

export function LeveragePopover({ symbol }: Props) {
  const [open, setOpen] = useState(false)
  const trpcUtils = trpc.useUtils()
  const { apiKey, isTestnetAccount, secretKey } = useAccountStore()
  const { data: positions, isPending: isPendingPositions } =
    trpc.getPositions.useQuery(
      { apiKey, secretKey, isTestnetAccount },
      {
        enabled: apiKey.length > 0 && secretKey.length > 0,
      },
    )
  const { mutateAsync: setLeverage, isPending: isPendingSetLeverage } =
    trpc.setLeverage.useMutation()

  const form = useForm<LeverageSchema>({
    resolver: zodResolver(leverageSchema),
    defaultValues: {
      symbol,
      leverage: 20,
    },
  })

  const { setValue } = form

  async function handleSetLeverage(data: LeverageSchema) {
    try {
      await setLeverage({
        api: {
          apiKey,
          secretKey,
          isTestnetAccount,
          data,
        },
      })

      toast.success(`Leverage for ${data.symbol} was set!`)
      await trpcUtils.getPositions.invalidate()
    } catch (error) {
      resolveError(error, "Couldn't set the leverage.")
    }
  }

  useEffect(() => {
    const position = positions?.find((position) => position.symbol === symbol)

    if (position) {
      setValue('leverage', Number(position.leverage))
    }
  }, [open, positions, setValue, symbol])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" disabled={isPendingPositions}>
          {isPendingPositions || !positions ? (
            <Spinner />
          ) : (
            `${positions.find((position) => position.symbol === symbol)?.leverage}x`
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={stopPropagate(form.handleSubmit(handleSetLeverage))}
            className="space-y-5"
          >
            <div className="mb-5 space-y-2">
              <h4 className="font-medium leading-none">Adjust leverage</h4>
              <p className="text-sm text-muted-foreground">
                Set the leverage for {symbol}.
              </p>
            </div>
            <FormField
              control={form.control}
              name="leverage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leverage - {field.value}x</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={125}
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
            <Button
              type="submit"
              className="flex w-32 items-center gap-2"
              variant="outline"
              disabled={isPendingSetLeverage || isPendingPositions}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {(isPendingSetLeverage || isPendingPositions) && <Spinner />}
              Confirm
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
