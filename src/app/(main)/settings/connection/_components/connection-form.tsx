'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAccountStore } from '@/hooks/store/use-account-store'
import { ConnectionSchema, connectionSchema } from '@/schemas/connection-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SaveIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function ConnectionForm() {
  const { isTestnetAccount } = useAccountStore()
  const form = useForm<ConnectionSchema>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      isTestnetAccount: false,
    },
  })

  const { reset } = form

  async function onSubmit(data: ConnectionSchema) {
    useAccountStore.setState((state) => ({
      ...state,
      isTestnetAccount: data.isTestnetAccount,
    }))

    toast.success('Connection preferences saved!')
  }

  useEffect(() => {
    reset({ isTestnetAccount })
  }, [isTestnetAccount, reset])

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="isTestnetAccount"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center lg:w-2/3">
              <div className="space-y-0.5">
                <FormLabel htmlFor="testnet" className="text-base">
                  Testnest credentials
                </FormLabel>

                <FormDescription>
                  <Label htmlFor="testnet" className="font-normal">
                    Set whether your credentials are from a Binance testnet
                    account.
                  </Label>
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  id="testnet"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-fit">
          <SaveIcon className="mr-2 size-4" />
          Save
        </Button>
      </form>
    </Form>
  )
}
