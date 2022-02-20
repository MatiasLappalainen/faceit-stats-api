import { Express, Request, Response } from 'express';
import logger from '../utils/logger';
import { getMatches } from '../utils/database';
import { getErrorMessage } from '../utils/helpers';

export const useExampleData = async ({
  matchId,
  limit,
  skip,
  from,
  to,
}: {
  matchId?: string;
  limit?: number;
  skip?: number;
  from?: string;
  to?: string;
}) => {
  try {
    const { default: items } = await import('../example-data/matches.json');
    let result = items;

    if (matchId) {
      result = result.filter((el) => el.match_id === matchId);
    }

    if (from) {
      result = result.filter((el) => el.date > from);
    }

    if (to) {
      result = result.filter((el) => el.date < to);
    }

    if (skip) {
      result = result.splice(skip, result.length);
    }

    if (limit) {
      result = result.splice(0, limit);
    }
    return result;
  } catch (err) {
    logger.error(err);
    return [];
  }
};

const listMatches = async (req: Request, res: Response) => {
  try {
    const { limit, skip, from, to } = req.query;
    let matches = [];
    if (process.env.USE_EXAMPLE_DATA) {
      matches = await useExampleData(req.query);
    } else {
      matches = await getMatches({
        limit: Number(limit),
        skip: Number(skip),
        from: from as string,
        to: to as string,
      });
    }

    res.json({
      status: 200,
      items: matches.slice(0, limit),
      hasMore: matches.length > Number(limit),
    });
  } catch (err) {
    res.json({ status: 500, error: getErrorMessage(err) });
  }
};

const listMatch = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const matches = await getMatches({ matchId: key });
    res.json({ status: 200, item: matches[0] });
  } catch (err) {
    res.json({ status: 500, error: getErrorMessage(err) });
  }
};

export const matchService = async (app: Express) => {
  return {
    list: app.get('/v1/matches', (req, res) => listMatches(req, res)),
    get: app.get('/v1/matches/:key', (req, res) => listMatch(req, res)),
  };
};
