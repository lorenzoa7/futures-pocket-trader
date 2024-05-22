import { getPositions } from '@/api/get-positions'
import { TRPCError, inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { baseApiSchema } from './schemas/base-api-schema'
import { createTRPCRouter, publicProcedure } from './trpc'

export const appRouter = createTRPCRouter({
  getPositions: publicProcedure
    .input(baseApiSchema)
    .query(async ({ input }) => {
      const { apiKey, isTestnetAccount, secretKey } = input

      if (apiKey.length === 0 || secretKey.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'You have to set your credentials keys in order to make this request.',
        })
      }

      const positions = await getPositions({
        apiKey,
        isTestnetAccount,
        secretKey,
      })

      return positions
    }),
})

export type AppRouter = typeof appRouter
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
