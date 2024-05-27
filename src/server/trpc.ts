import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

export const {
  router: createTRPCRouter,
  procedure: publicProcedure,
  createCallerFactory,
  mergeRouters,
} = t
