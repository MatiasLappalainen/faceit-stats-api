"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchService = void 0;
const database_1 = require("../utils/database");
const helpers_1 = require("../utils/helpers");
const listMatches = async (req, res) => {
    try {
        const { limit, skip, from, to } = req.query;
        const matches = await (0, database_1.getMatches)({
            limit: Number(limit),
            skip: Number(skip),
            from: from,
            to: to,
        });
        res.json({
            status: 200,
            items: matches.slice(0, limit),
            hasMore: matches.length > Number(limit),
        });
    }
    catch (err) {
        res.json({ status: 500, error: (0, helpers_1.getErrorMessage)(err) });
    }
};
const listMatch = async (req, res) => {
    try {
        const { key } = req.params;
        const matches = await (0, database_1.getMatches)({ matchId: key });
        res.json({ status: 200, item: matches[0] });
    }
    catch (err) {
        res.json({ status: 500, error: (0, helpers_1.getErrorMessage)(err) });
    }
};
const matchService = async (app) => {
    return {
        list: app.get('/v1/matches', (req, res) => listMatches(req, res)),
        get: app.get('/v1/matches/:key', (req, res) => listMatch(req, res)),
    };
};
exports.matchService = matchService;
//# sourceMappingURL=match.js.map