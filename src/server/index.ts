import { getPositions } from '@/api/get-positions'
import { getSymbolPrice } from '@/api/get-symbol-price'
import { getSymbols } from '@/api/get-symbols'
import { newOrder } from '@/api/new-order'
import { throwApiError } from '@/functions/get-api-error-message'
import { validateKeys } from '@/functions/validate-keys'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import {
  baseApiSchema,
  baseApiSchemaWithCredentials,
} from './schemas/base-api-schema'
import { getSymbolPriceSchema } from './schemas/get-symbol-price-schema'
import { newOrderSchema } from './schemas/new-order-schema'
import { createTRPCRouter, publicProcedure } from './trpc'

export const appRouter = createTRPCRouter({
  getPositions: publicProcedure
    .input(baseApiSchemaWithCredentials)
    .query(async ({ input }) => {
      const { apiKey, isTestnetAccount, secretKey } = input

      validateKeys({ apiKey, secretKey })

      try {
        const positions = await getPositions({
          apiKey,
          isTestnetAccount,
          secretKey,
        })

        return positions
      } catch (error) {
        throwApiError({ error, errorMessage: "Couldn't fetch your positions." })
      }
    }),
  getSymbols: publicProcedure.input(baseApiSchema).query(async ({ input }) => {
    const { isTestnetAccount } = input

    try {
      const symbols = await getSymbols({
        isTestnetAccount,
      })

      return symbols
    } catch (error) {
      throwApiError({ error, errorMessage: "Couldn't load coins." })
    }
  }),
  getSymbolPrice: publicProcedure
    .input(getSymbolPriceSchema)
    .query(async ({ input }) => {
      const { isTestnetAccount, symbol } = input

      try {
        const symbolprice = await getSymbolPrice({
          isTestnetAccount,
          symbol,
        })

        return symbolprice
      } catch (error) {
        throwApiError({ error, errorMessage: "Couldn't load the last price." })
      }
    }),
  newOrder: publicProcedure
    .input(newOrderSchema)
    .mutation(async ({ input }) => {
      const { api, noErrorMessage } = input

      try {
        const response = await newOrder(api)

        return response
      } catch (error) {
        if (!noErrorMessage) {
          throwApiError({ error, errorMessage: "Couldn't create a new order." })
          return
        }

        console.error(error)
      }
    }),
})

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
