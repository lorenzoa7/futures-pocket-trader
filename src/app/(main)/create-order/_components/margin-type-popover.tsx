import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItemVariant } from '@/components/ui/radio-group'
import Spinner from '@/components/ui/spinner'
import { resolveError } from '@/functions/resolve-error'
import { stopPropagate } from '@/functions/stop-propagate'
import { useAccountStore } from '@/hooks/store/use-account-store'
import {
  MarginTypeSchema,
  marginTypeSchema,
} from '@/schemas/margin-type-schema'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type Props = {
  symbol: string
}

export function MarginTypePopover({ symbol }: Props) {
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
  const { mutateAsync: setMarginType, isPending: isPendingSetMarginType } =
    trpc.setMarginType.useMutation()

  const form = useForm<MarginTypeSchema>({
    resolver: zodResolver(marginTypeSchema),
    defaultValues: {
      symbol,
      marginType: 'CROSSED',
    },
  })

  const { setValue } = form

  async function handleSetMarginType(data: MarginTypeSchema) {
    try {
      await setMarginType({
        api: {
          apiKey,
          secretKey,
          isTestnetAccount,
          data,
        },
      })

      toast.success(`Margin type for ${data.symbol} was set!`)
      await trpcUtils.getPositions.invalidate()
    } catch (error) {
      resolveError(error, "Couldn't set the margin type.")
    }
  }

  useEffect(() => {
    const position = positions?.find((position) => position.symbol === symbol)

    if (position) {
      setValue(
        'marginType',
        position.marginType === 'isolated' ? 'ISOLATED' : 'CROSSED',
      )
    }
  }, [open, positions, setValue, symbol])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" disabled={isPendingPositions}>
          {isPendingPositions || !positions ? (
            <Spinner />
          ) : (
            `${positions.find((position) => position.symbol === symbol)?.marginType === 'isolated' ? 'Isolated' : 'Cross'}`
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={stopPropagate(form.handleSubmit(handleSetMarginType))}
            className="space-y-5"
          >
            <div className="mb-5 space-y-2">
              <h4 className="font-medium leading-none">Adjust margin type</h4>
              <p className="text-sm text-muted-foreground">
                Set the margin type for {symbol}.
              </p>
            </div>
            <FormField
              control={form.control}
              name="marginType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItemVariant
                            label="Isolated"
                            value="ISOLATED"
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItemVariant
                            label="Cross"
                            value="CROSSED"
                          />
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex w-32 items-center gap-2"
              variant="outline"
              disabled={isPendingSetMarginType || isPendingPositions}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {(isPendingSetMarginType || isPendingPositions) && <Spinner />}
              Confirm
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
