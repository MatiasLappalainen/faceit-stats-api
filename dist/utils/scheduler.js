"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduler = void 0;
const bree_1 = __importDefault(require("bree"));
// https://www.npmjs.com/package/bree
exports.scheduler = new bree_1.default({
    root: `${process.cwd()}/jobs`,
    jobs: [
        {
            name: 'stats',
            // Every day at 00:00 https://crontab.guru/#0_0_*_*_*
            cron: process.env.DEBUG ? '1/2 * * * *' : '0 0 * * *',
        },
    ],
});
//# sourceMappingURL=scheduler.js.map