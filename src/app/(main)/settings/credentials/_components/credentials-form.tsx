'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { encryptKey } from '@/functions/encrypt-key'
import { useAccountStore } from '@/hooks/store/use-account-store'
import {
  CredentialsSchema,
  credentialsSchema,
} from '@/schemas/credentials-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyIcon, SaveIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function CredentialsForm() {
  const { apiKey, secretKey } = useAccountStore()
  const form = useForm<CredentialsSchema>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      apiKey: '',
      secretKey: '',
    },
  })

  const { reset } = form

  async function onSubmit(data: CredentialsSchema) {
    const encryptedApiKey = encryptKey(data.apiKey)
    const encryptedSecretKey = encryptKey(data.secretKey)

    useAccountStore.setState((state) => ({
      ...state,
      apiKey: encryptedApiKey,
      secretKey: encryptedSecretKey,
    }))

    reset()

    toast.success('Credentials keys saved!')
  }

  return (
    <>
      {apiKey.length > 0 && secretKey.length > 0 && (
        <div className="mb-4 space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm">
            <KeyIcon className="size-5" />
            <p>You already have credentials keys saved in the application.</p>
          </div>
          <Separator className="sm:hidden" />
          <div className="relative flex justify-center text-xs uppercase sm:hidden">
            <span className="bg-background text-center text-muted-foreground">
              But you can override them and save new ones
            </span>
          </div>
          <div className="relative hidden sm:block">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                But you can override them and save new ones
              </span>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your API key</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="w-full lg:w-96"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secretKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your secret key</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="w-full lg:w-96"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-fit">
            <SaveIcon className="mr-2 size-4" />
            Save
          </Button>
        </form>
      </Form>
    </>
  )
}
