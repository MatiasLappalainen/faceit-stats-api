import pinoLogger from 'pino';

// Pino logger https://github.com/pinojs/pino
export default pinoLogger({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
