"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../utils/helpers");
const database_1 = require("../utils/database");
// Faceit player id, can be found from https://developers.faceit.com
const playerId = process.env.PLAYER_ID;
const fetchMatchStats = async (match) => {
    const res = await (0, helpers_1.faceitApiClient)(`/matches/${match.match_id}/stats`);
    const json = await res.json();
    const players = json?.rounds?.[0].teams.flatMap((teams) => teams?.players);
    const player = players?.find((el) => el.player_id === playerId)?.player_stats;
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
    const res = await (0, helpers_1.faceitApiClient)(`/players/${playerId}/history?limit=250`);
    const { items } = await res.json();
    const matches = items.map((el) => ({
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
        await (0, database_1.upsertMatches)(stats);
    }
    catch (err) {
        console.error(err);
    }
};
handler();
//# sourceMappingURL=stats.js.map