import knex, { type Knex } from 'knex';
import logger from './logger';
/**
 * Database client using knex
 */
const dbConfig = {
  client: 'pg',
  connection: process.env.DATABASE_CONNECTION_URL,
  searchPath: ['knex', 'public'],
};
/**
 * Function for creating database requests
 * and destroying it automatically
 * to prevent db flooding with connections
 */
export const sendDatabaseRequest = async (fn: (db: Knex<any, unknown[]>) => Promise<any>) => {
  const db = knex(dbConfig);
  const result = await fn(db);
  await db.destroy();
  return result;
};

export const initDatabase = async (db: Knex<any, unknown[]>) => {
  try {
    const hasTableCompany = await db.schema.hasTable('match');
    if (!hasTableCompany) {
      logger.info('Table not found creating new table match');
      await db.schema.createTable('match', (table) => {
        table.string('match_id').primary();
        table.datetime('date');
        table.integer('headshots');
        table.integer('kills');
        table.integer('deaths');
        table.integer('assists');
        table.integer('quadro');
        table.integer('triple');
        table.integer('penta');
        table.integer('win');
        table.string('map');
        table.integer('rounds');
      });
    }
  } catch (error) {
    console.error(error);
  }
};

interface GetMatches {
  matchId?: string;
  limit?: number;
  skip?: number;
  from?: string;
  to?: string;
}

export const getMatches = async ({
  matchId,
  limit = 1000,
  skip = 0,
  from = '',
  to = '',
}: GetMatches) => {
  const matches = await sendDatabaseRequest(async (db) => {
    const query = db('match')
      .select('*')
      .orderBy('date', 'desc')
      .limit(limit + 1)
      .offset(skip);

    // Allows to pull only one match
    if (matchId) {
      query.where('match_id', matchId);
    }

    if (from) {
      query.where('date', '>', from);
    }

    if (to) {
      query.where('date', '<', to);
    }

    return await query;
  });

  return matches;
};

export const upsertMatches = async (matches: FaceitStats.MatchStats[]) => {
  await sendDatabaseRequest(
    async (db) => await db('match').insert(matches).onConflict(['match_id']).merge()
  );
};
