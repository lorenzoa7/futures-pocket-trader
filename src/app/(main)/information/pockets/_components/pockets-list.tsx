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
import { ChevronDownIcon, ChevronRightIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'

export function PocketsList() {
  const { pockets, selectedPocketId } = useAccountStore()
  const selectedPocket = pockets.find(
    (pocket) => pocket.id === selectedPocketId,
  )

  const form = useForm<PocketInformationSchema>({
    resolver: zodResolver(pocketInformationSchema),
    defaultValues: {
      name: '',
    },
  })

  const { reset } = form

  function onSubmit(data: PocketInformationSchema) {
    const { name } = data

    if (pockets.some((pocket) => pocket.name === name)) {
      toast.error("There's already a pocket with this name.")
      return
    }

    const newPocket = { id: uuid(), name, symbols: [] }

    useAccountStore.setState((state) => ({
      ...state,
      pockets: [...state.pockets, newPocket],
      selectedPocketId: newPocket.id,
    }))

    reset()
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

        <ScrollArea className="mt-2 h-80 2xl:h-96">
          <div className="flex flex-col gap-2">
            {pockets.map((pocket) => (
              <>
                <div
                  key={pocket.id}
                  data-selected={selectedPocket?.id === pocket.id}
                  onClick={() =>
                    useAccountStore.setState((state) => ({
                      ...state,
                      selectedPocketId: pocket.id,
                    }))
                  }
                  className="group hidden w-full cursor-pointer items-center justify-between rounded-md border border-border p-3 text-sm duration-200 hover:bg-muted/25 data-[selected=true]:bg-muted/50 lg:flex"
                >
                  {pocket.name}

                  <ChevronRightIcon
                    data-selected={selectedPocketId === pocket.id}
                    className="size-5 duration-200 group-hover:translate-x-1 data-[selected=true]:translate-x-1"
                  />
                </div>

                <Link
                  href={'#pocket-information'}
                  onClick={(e) => {
                    e.preventDefault()

                    useAccountStore.setState((state) => ({
                      ...state,
                      selectedPocketId: pocket.id,
                    }))

                    const href = e.currentTarget.href
                    const sectionId = href.replace(/.*#/, '')
                    const sectionElement = document.getElementById(sectionId)

                    sectionElement?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }}
                  data-selected={selectedPocket?.id === pocket.id}
                  className="group flex w-full cursor-pointer items-center justify-between rounded-md border border-border p-3 text-sm duration-200 hover:bg-muted/25 data-[selected=true]:bg-muted/50 lg:hidden"
                >
                  {pocket.name}

                  <ChevronDownIcon
                    data-selected={selectedPocketId === pocket.id}
                    className="size-5 duration-200 group-hover:translate-y-1 data-[selected=true]:translate-y-1"
                  />
                </Link>
              </>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
