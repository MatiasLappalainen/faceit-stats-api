"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchService = exports.useExampleData = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const database_1 = require("../utils/database");
const helpers_1 = require("../utils/helpers");
const useExampleData = async ({ matchId, limit, skip, from, to, }) => {
    try {
        const { default: items } = await Promise.resolve().then(() => __importStar(require('../example-data/matches.json')));
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
    }
    catch (err) {
        logger_1.default.error(err);
        return [];
    }
};
exports.useExampleData = useExampleData;
const listMatches = async (req, res) => {
    try {
        const { limit, skip, from, to } = req.query;
        let matches = [];
        if (process.env.USE_EXAMPLE_DATA) {
            matches = await (0, exports.useExampleData)(req.query);
        }
        else {
            matches = await (0, database_1.getMatches)({
                limit: Number(limit),
                skip: Number(skip),
                from: from,
                to: to,
            });
        }
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