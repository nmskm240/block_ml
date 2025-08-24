import pino, { Logger } from 'pino';

const pinoOptions: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
};

// NODE_ENVが'production'でない場合のみpino-prettyを適用
if (process.env.NODE_ENV !== 'production') {
  pinoOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    },
  };
}

const logger: Logger = pino(pinoOptions);

export default logger;
export type { Logger };
