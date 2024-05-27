import { cancelOrder } from '@/api/cancel-order'
import { getOrders } from '@/api/get-orders'
import { getPositions } from '@/api/get-positions'
import { getSymbolPrice } from '@/api/get-symbol-price'
import { getSymbols } from '@/api/get-symbols'
import { newOrder } from '@/api/new-order'
import { setLeverage } from '@/api/set-leverage'
import { setMarginType } from '@/api/set-margin-type'
import { throwApiError } from '@/functions/get-api-error-message'
import { validateKeys } from '@/functions/validate-keys'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import {
  baseApiSchema,
  baseApiSchemaWithCredentials,
} from './schemas/base-api-schema'
import { cancelOrderSchema } from './schemas/cancel-order-schema'
import { getSymbolPriceSchema } from './schemas/get-symbol-price-schema'
import { newOrderSchema } from './schemas/new-order-schema'
import { setLeverageSchema } from './schemas/set-leverage-schema'
import { setMarginTypeSchema } from './schemas/set-margin-type-schema'
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
  getOrders: publicProcedure
    .input(baseApiSchemaWithCredentials)
    .query(async ({ input }) => {
      const { apiKey, isTestnetAccount, secretKey } = input

      validateKeys({ apiKey, secretKey })

      try {
        const orders = await getOrders({
          apiKey,
          isTestnetAccount,
          secretKey,
        })

        return orders
      } catch (error) {
        throwApiError({
          error,
          errorMessage: "Couldn't fetch your orders.",
        })
      }
    }),
  cancelOrder: publicProcedure
    .input(cancelOrderSchema)
    .mutation(async ({ input }) => {
      const { api, noErrorMessage } = input

      try {
        const response = await cancelOrder(api)

        return response
      } catch (error) {
        if (!noErrorMessage) {
          throwApiError({ error, errorMessage: "Couldn't cancel the order." })
          return
        }

        console.error(error)
      }
    }),
  setLeverage: publicProcedure
    .input(setLeverageSchema)
    .mutation(async ({ input }) => {
      const { api, noErrorMessage } = input

      try {
        const response = await setLeverage(api)

        return response
      } catch (error) {
        if (!noErrorMessage) {
          throwApiError({ error, errorMessage: "Couldn't set the leverage." })
          return
        }

        console.error(error)
      }
    }),
  setMarginType: publicProcedure
    .input(setMarginTypeSchema)
    .mutation(async ({ input }) => {
      const { api, noErrorMessage } = input

      try {
        const response = await setMarginType(api)

        return response
      } catch (error) {
        if (!noErrorMessage) {
          throwApiError({
            error,
            errorMessage: "Couldn't set the margin type.",
          })
          return
        }

        console.error(error)
      }
    }),
})

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
