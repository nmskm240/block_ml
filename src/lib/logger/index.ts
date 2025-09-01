import pino, { Logger } from 'pino';

const options: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  // transport: (process.env.NODE_ENV === 'development') ? {
  //   target: 'pino-pretty',
  //   options: {
  //     colorize: true,
  //     translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
  //     ignore: 'pid,hostname',
  //   },
  // } : undefined,
};

const logger: Logger = pino(options);

export default logger;
export type { Logger };