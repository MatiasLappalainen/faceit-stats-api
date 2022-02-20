import { faceitApiClient, getErrorMessage } from '../utils/helpers';
import { upsertMatches } from '../utils/database';
import logger from '../utils/logger';

// Faceit player id, can be found from https://developers.faceit.com
const playerId = process.env.PLAYER_ID;

const fetchMatchStats = async (match: {
  match_id: string;
  date: number;
}): Promise<FaceitStats.MatchStats> => {
  const res: any = await faceitApiClient.matchStats(match.match_id);
  const json = await res.json();

  const players = json?.rounds?.[0].teams.flatMap((teams: { players: any }) => teams?.players);

  const player = players?.find((el: any) => el.player_id === playerId)?.player_stats;

  const roundStats = json.rounds?.[0]?.round_stats;

  return {
    ...match,
    win: Number(player?.Result),
    headshots: player?.Headshots,
    kills: player?.Kills,
    deaths: player?.Deaths,
    assists: player?.Assists,
    triple: player?.['Triple Kills'],
    quadro: player?.['Quadro Kills'],
    penta: player?.['Penta Kills'],
    rounds: roundStats?.Rounds,
    map: roundStats?.Map,
  };
};

const fetchMatches = async () => {
  if (!playerId) throw Error('No player id provided');
  const res: any = await faceitApiClient.playerMatchHistory(playerId, { limit: 250 });
  const { items } = await res.json();
  const matches = items.map((el: { match_id: string; [key: string]: any }) => ({
    match_id: el.match_id,
    date: new Date(el.finished_at * 1000).toISOString(),
  }));
  return matches;
};

const handler = async () => {
  try {
    const matches = await fetchMatches();
    const stats = [];

    for (const match of matches) {
      stats.push(await fetchMatchStats(match));
    }
    await upsertMatches(stats);
  } catch (err) {
    logger.error(err);
  }
};

handler();
