'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAccountStore } from '@/hooks/store/use-account-store'
import {
  PocketInformationSchema,
  pocketInformationSchema,
} from '@/schemas/pocket-information-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRightIcon, PlusIcon, XIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

export function PocketsList() {
  const { pockets, selectedPocket } = useAccountStore()

  const form = useForm<PocketInformationSchema>({
    resolver: zodResolver(pocketInformationSchema),
    defaultValues: {
      name: '',
    },
  })

  function onSubmit(data: PocketInformationSchema) {
    const { name } = data

    if (pockets.some((pocket) => pocket.name === name)) {
      toast.error("There's already a pocket with this name.")
      return
    }

    useAccountStore.setState((state) => ({
      ...state,
      pockets: [...state.pockets, { id: uuid(), name, symbols: [] }],
    }))
  }

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Pockets</CardTitle>
      </CardHeader>
      <CardContent className="lg:py-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create a new pocket</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="Name..." {...field} />
                    </FormControl>
                    <Button size="icon" variant="outline" type="submit">
                      <PlusIcon className="size-5" />
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <ScrollArea className="mt-2 h-96">
          <div className="flex flex-col gap-2">
            {pockets.map((pocket) => (
              <div
                key={pocket.id}
                data-selected={selectedPocket?.id === pocket.id}
                onClick={() =>
                  useAccountStore.setState((state) => ({
                    ...state,
                    selectedPocket: pocket,
                  }))
                }
                className="group flex w-full cursor-pointer items-center justify-between rounded-md border border-border p-3 text-sm duration-200 hover:bg-muted/25 data-[selected=true]:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="none"
                    variant="ghost"
                    className="duration-200 hover:scale-110"
                    onClick={() =>
                      useAccountStore.setState((state) => ({
                        ...state,
                        pockets: state.pockets.filter(
                          (savedPocket) => pocket.id !== savedPocket.id,
                        ),
                      }))
                    }
                  >
                    <XIcon className="size-4 " />
                  </Button>
                  {pocket.name}
                </div>
                <ChevronRightIcon
                  data-selected={selectedPocket?.id === pocket.id}
                  className="size-5 duration-200 group-hover:translate-x-1 data-[selected=true]:translate-x-1"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
