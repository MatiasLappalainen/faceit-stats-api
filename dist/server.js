"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const scheduler_1 = require("./utils/scheduler");
const routes_1 = __importDefault(require("./routes"));
const database_1 = require("./utils/database");
const pino_http_1 = __importDefault(require("pino-http"));
const startApi = async () => {
    const app = (0, express_1.default)();
    const port = process.env.PORT || 4242;
    await (0, database_1.sendDatabaseRequest)(async (db) => {
        await (0, database_1.initDatabase)(db);
        console.info('DB initialized');
    });
    app.use((0, cors_1.default)());
    app.use((0, pino_http_1.default)());
    await (0, routes_1.default)(app);
    scheduler_1.scheduler.start();
    app.listen(port, () => {
        console.info(`App listening on port ${port}`);
    });
};
startApi();
//# sourceMappingURL=server.js.map