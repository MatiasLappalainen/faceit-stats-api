import { Express, Request, Response } from 'express';
import { getMatches } from '../utils/database';
import { getErrorMessage } from '../utils/helpers';

const listMatches = async (req: Request, res: Response) => {
  try {
    const { limit, skip, from, to } = req.query;
    const matches = await getMatches({
      limit: Number(limit),
      skip: Number(skip),
      from: from as string,
      to: to as string,
    });

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
