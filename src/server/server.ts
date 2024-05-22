import 'server-only'
import { appRouter } from '.'
import { createCallerFactory } from './trpc'

export const trpcServer = createCallerFactory(appRouter)
