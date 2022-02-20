import Bree from 'bree';

// https://www.npmjs.com/package/bree
export const scheduler = new Bree({
  root: `${process.cwd()}/jobs`,
  jobs: [
    {
      name: 'stats',
      // Every day at 00:00 https://crontab.guru/#0_0_*_*_*
      cron: process.env.DEBUG ? '1/2 * * * *' : '0 0 * * *',
    },
  ],
});
