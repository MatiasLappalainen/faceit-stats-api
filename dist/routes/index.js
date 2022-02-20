"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match_1 = require("./match");
/**
 * Helper for extending api service.
 * To add new service add it to list below,
 * and it will be initialized launch
 */
exports.default = async (app) => {
    await (0, match_1.matchService)(app);
};
//# sourceMappingURL=index.js.map