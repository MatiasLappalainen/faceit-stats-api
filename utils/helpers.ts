import fetch from 'node-fetch';
import qs from 'qs';

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

/**
 * Helper for faceit api requests
 */
const faceitBaseUrl = 'https://open.faceit.com/data/v4';

export const faceitApi = (url: string, params?: { [key: string]: any }) => {
  const query = qs.stringify(params);

  return fetch(faceitBaseUrl + url + query, {
    headers: {
      Authorization: 'Bearer ' + process.env.FACEIT_TOKEN,
    },
  });
};

export const faceitApiClient = {
  matchStats: (matchId: string) => faceitApi(`/matches/${matchId}/stats`),
  playerMatchHistory: (playerId: string, params?: { [key: string]: any }) =>
    faceitApi(`/players/${playerId}/history?`, params),
};
