import { projectRouter } from '@/modules/projects/server/procedures';
import { createTRPCRouter } from '../init';
import { messagesRouter } from '@/modules/messages/server/procedures';
import { usageRouter } from '@/modules/usage/server/procedures';


export const appRouter = createTRPCRouter({
  usage: usageRouter,
  messages: messagesRouter,
  projects: projectRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;