import type { Express } from 'express';
import { matchService } from './match';

/**
 * Helper for extending api service.
 * To add new service add it to list below,
 * and it will be initialized launch
 */
export default async (app: Express) => {
  await matchService(app);
};
