import { initTRPC } from '@trpc/server'
import SuperJSON from 'superjson'

const t = initTRPC.create({
  transformer: SuperJSON,
})

export const {
  router: createTRPCRouter,
  procedure: publicProcedure,
  createCallerFactory,
  mergeRouters,
} = t
