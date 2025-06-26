import { Mastra } from '@mastra/core';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { CustomerAuditAgent } from './agents/CustomerAuditAgent';

export const mastra = new Mastra({
  agents: { CustomerAuditAgent },
  storage: new LibSQLStore({
    url: ':memory:', // Change to 'file:../mastra.db' if persistence is needed
  }),
  logger: new PinoLogger({
    name: 'AiDit Agent',
    level: 'info',
  }),
});
