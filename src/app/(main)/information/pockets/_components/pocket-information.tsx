'use client'

import { GetSymbolsResponse } from '@/api/get-symbols'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import Spinner from '@/components/ui/spinner'
import { useAccountStore } from '@/hooks/store/use-account-store'
import {
  PocketSymbolsSchema,
  pocketSymbolsSchema,
} from '@/schemas/pocket-symbols-schema'
import { trpc } from '@/server/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, SaveIcon, Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import SearchBox from './search-box'

export function PocketInformation() {
  const { selectedPocketId, isTestnetAccount, pockets } = useAccountStore()
  const selectedPocket = pockets.find(
    (pocket) => pocket.id === selectedPocketId,
  )

  const { data: symbols, isPending: isPendingSymbols } =
    trpc.getSymbols.useQuery(
      { isTestnetAccount },
      {
        staleTime: 1000 * 60 * 10,
        select: (data) => {
          if (selectedPocket && data) {
            return data.sort((symbolA, symbolB) => {
              // Verify if symbolA is selected
              const isSymbolASelected = selectedPocket.symbols.includes(
                symbolA.symbol,
              )
              // Verify if symbolB is selected
              const isSymbolBSelected = selectedPocket.symbols.includes(
                symbolB.symbol,
              )

              // If symbolA is selected and symbolB doesn't, place symbolA before symbolB
              if (isSymbolASelected && !isSymbolBSelected) {
                return -1
              }
              // If symbolB is selected and symbolA doesn't, place symbolB before symbolA
              if (isSymbolBSelected && !isSymbolASelected) {
                return 1
              }
              // If both are selected or none is, order alphabetically
              return symbolA.symbol.localeCompare(symbolB.symbol)
            })
          }

          return data
        },
      },
    )
  const trpcUtils = trpc.useUtils()
  const [activeSearch, setActiveSearch] = useState<
    GetSymbolsResponse['symbols']
  >(symbols ?? [])

  const form = useForm<PocketSymbolsSchema>({
    resolver: zodResolver(pocketSymbolsSchema),
    defaultValues: {
      symbols: selectedPocket
        ? selectedPocket.symbols.map((symbol) => ({ name: symbol }))
        : [],
    },
  })

  const { setValue, watch } = form
  const symbolsWatch = watch('symbols')

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if (symbols) {
      if (e.target.value === '') {
        setActiveSearch(symbols)
        return
      }

      setActiveSearch(
        symbols.filter((symbol) =>
          symbol.symbol.toLowerCase().includes(e.target.value.toLowerCase()),
        ),
      )
    }
  }

  function handleClickSymbol(symbol: string) {
    if (!selectedPocket) {
      return
    }

    if (symbolsWatch.map((symbol) => symbol.name).includes(symbol)) {
      setValue(
        'symbols',
        symbolsWatch.filter((selectedSymbol) => selectedSymbol.name !== symbol),
      )
      return
    }

    setValue('symbols', [...symbolsWatch, { name: symbol }])
  }

  function onSubmit(data: PocketSymbolsSchema) {
    const { symbols } = data
    const symbolsNames = symbols.map((symbol) => symbol.name)

    if (selectedPocket) {
      useAccountStore.setState((state) => {
        const selectedExistingPocket = state.pockets.find(
          (pocket) => selectedPocketId === pocket.id,
        )

        if (selectedExistingPocket) {
          return {
            ...state,
            pockets: state.pockets.map((pocket) => {
              if (pocket.id === selectedExistingPocket.id) {
                return { ...pocket, symbols: symbolsNames }
              }

              return pocket
            }),
          }
        }

        return state
      })

      trpcUtils.getSymbols.setData({ isTestnetAccount }, (data) => {
        if (data) {
          const sortedData = data.sort((symbolA, symbolB) => {
            // Verify if symbolA is selected
            const isSymbolASelected = symbolsNames.includes(symbolA.symbol)
            // Verify if symbolB is selected
            const isSymbolBSelected = symbolsNames.includes(symbolB.symbol)

            // If symbolA is selected and symbolB doesn't, place symbolA before symbolB
            if (isSymbolASelected && !isSymbolBSelected) {
              return -1
            }
            // If symbolB is selected and symbolA doesn't, place symbolB before symbolA
            if (isSymbolBSelected && !isSymbolASelected) {
              return 1
            }
            // If both are selected or none is, order alphabetically
            return symbolA.symbol.localeCompare(symbolB.symbol)
          })

          return sortedData
        }

        return data
      })

      toast.success(`Pocket "${selectedPocket.name}" updated successfully!`)
      return
    }

    toast.error("Couldn't find this pocket. Try again later!")
  }

  function handleDeletePocket(pocketId: string) {
    useAccountStore.setState((state) => ({
      ...state,
      pockets: state.pockets.filter(
        (savedPocket) => pocketId !== savedPocket.id,
      ),
      selectedPocket:
        state.selectedPocketId === pocketId
          ? undefined
          : state.selectedPocketId,
    }))
  }

  useEffect(() => {
    if (symbols) {
      setActiveSearch(symbols)
    }
  }, [symbols, setValue])

  useEffect(() => {
    if (selectedPocket) {
      const selectedSymbols = selectedPocket.symbols.map((symbol) => ({
        name: symbol,
      }))

      setValue('symbols', selectedSymbols)
    }
  }, [selectedPocket, setValue])

  return (
    <Card className="flex-1">
      {selectedPocket && (
        <>
          <CardHeader>
            <CardTitle>{`"${selectedPocket.name}" information`}</CardTitle>
          </CardHeader>
          <CardContent>
            {isPendingSymbols ? (
              <div className="mt-2 flex w-full items-center justify-center">
                <Spinner className="size-10" />
              </div>
            ) : (
              <>
                <SearchBox
                  placeholder="Search for a symbol..."
                  withIcon
                  onChange={(e) => handleSearch(e)}
                  className="mr-3"
                />
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <ScrollArea className="mt-2 h-80 pr-3">
                    <div className="flex flex-col gap-2">
                      {activeSearch.length > 0 &&
                        activeSearch.map((symbol) => {
                          const isSelected = symbolsWatch
                            .map((symbol) => symbol.name)
                            .includes(symbol.symbol)

                          return (
                            <div
                              key={symbol.symbol}
                              data-selected={isSelected}
                              className="group flex w-full cursor-pointer items-center justify-between rounded-md border border-border p-3 text-sm duration-200 hover:bg-muted/25 data-[selected=true]:bg-muted/50"
                              onClick={() => handleClickSymbol(symbol.symbol)}
                            >
                              {symbol.symbol}
                              {isSelected && <CheckIcon className="size-4" />}
                            </div>
                          )
                        })}

                      {activeSearch.length === 0 && (
                        <div className="mt-3 text-center">No symbol found.</div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="flex items-center justify-end gap-2 pr-3">
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-fit"
                      onClick={() => handleDeletePocket(selectedPocket.id)}
                    >
                      <Trash2Icon className="mr-2 size-4" />
                      Delete
                    </Button>
                    <Button type="submit" className="w-fit">
                      <SaveIcon className="mr-2 size-4" />
                      Save
                    </Button>
                  </div>
                </form>
              </>
            )}
          </CardContent>
        </>
      )}

      {!selectedPocket && (
        <div className="flex size-full items-center justify-center">
          <span className="text-lg font-medium">Select a pocket</span>
        </div>
      )}
    </Card>
  )
}
