"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertMatches = exports.getMatches = exports.initDatabase = exports.sendDatabaseRequest = void 0;
const knex_1 = __importDefault(require("knex"));
const logger_1 = __importDefault(require("./logger"));
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
const sendDatabaseRequest = async (fn) => {
    const db = (0, knex_1.default)(dbConfig);
    const result = await fn(db);
    await db.destroy();
    return result;
};
exports.sendDatabaseRequest = sendDatabaseRequest;
const initDatabase = async (db) => {
    try {
        const hasTableCompany = await db.schema.hasTable('match');
        if (!hasTableCompany) {
            logger_1.default.info('Table not found creating new table match');
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
    }
    catch (error) {
        console.error(error);
    }
};
exports.initDatabase = initDatabase;
const getMatches = async ({ matchId, limit = 1000, skip = 0, from = '', to = '', }) => {
    const matches = await (0, exports.sendDatabaseRequest)(async (db) => {
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
exports.getMatches = getMatches;
const upsertMatches = async (matches) => {
    await (0, exports.sendDatabaseRequest)(async (db) => await db('match').insert(matches).onConflict(['match_id']).merge());
};
exports.upsertMatches = upsertMatches;
//# sourceMappingURL=database.js.map