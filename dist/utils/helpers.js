"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceitApiClient = exports.faceitApi = exports.getErrorMessage = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const qs_1 = __importDefault(require("qs"));
const getErrorMessage = (error) => {
    if (error instanceof Error)
        return error.message;
    return String(error);
};
exports.getErrorMessage = getErrorMessage;
/**
 * Helper for faceit api requests
 */
const faceitBaseUrl = 'https://open.faceit.com/data/v4';
const faceitApi = (url, params) => {
    const query = qs_1.default.stringify(params);
    return (0, node_fetch_1.default)(faceitBaseUrl + url + query, {
        headers: {
            Authorization: 'Bearer ' + process.env.FACEIT_TOKEN,
        },
    });
};
exports.faceitApi = faceitApi;
exports.faceitApiClient = {
    matchStats: (matchId) => (0, exports.faceitApi)(`/matches/${matchId}/stats`),
    playerMatchHistory: (playerId, params) => (0, exports.faceitApi)(`/players/${playerId}/history?`, params),
};
//# sourceMappingURL=helpers.js.map