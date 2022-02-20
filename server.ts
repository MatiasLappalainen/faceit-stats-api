import cors from 'cors';
import express from 'express';
import { scheduler } from './utils/scheduler';
import apiService from './routes';
import { initDatabase, sendDatabaseRequest } from './utils/database';
import pinoHttp from 'pino-http';
import logger from './utils/logger';

const startApi = async () => {
  const app = express();
  const port = process.env.PORT || 4242;

  await sendDatabaseRequest(async (db) => {
    await initDatabase(db);
    logger.info('DB initialized');
  });

  app.use(cors());
  app.use(
    pinoHttp({
      logger: logger,
    })
  );

  await apiService(app);

  scheduler.start();
  app.listen(port, () => {
    logger.info(`App listening on port ${port}`);
  });
};

startApi();
