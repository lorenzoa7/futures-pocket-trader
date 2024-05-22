import { getPositions } from '@/api/get-positions'
import { throwApiError } from '@/functions/get-api-error-message'
import { validateKeys } from '@/functions/validate-keys'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { baseApiSchema } from './schemas/base-api-schema'
import { createTRPCRouter, publicProcedure } from './trpc'

export const appRouter = createTRPCRouter({
  getPositions: publicProcedure
    .input(baseApiSchema)
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
})

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
