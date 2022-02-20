"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceitApiClient = exports.getErrorMessage = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const getErrorMessage = (error) => {
    if (error instanceof Error)
        return error.message;
    return String(error);
};
exports.getErrorMessage = getErrorMessage;
/**
 * Helper to use faceit api
 */
const faceitBaseUrl = 'https://open.faceit.com/data/v4';
const faceitApiClient = (url) => {
    return (0, node_fetch_1.default)(faceitBaseUrl + url, {
        headers: {
            Authorization: 'Bearer ' + process.env.FACEIT_TOKEN,
        },
    });
};
exports.faceitApiClient = faceitApiClient;
//# sourceMappingURL=helpers.js.map