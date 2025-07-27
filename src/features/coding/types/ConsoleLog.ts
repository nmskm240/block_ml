export const LogType = {
  None: 0,
  Out: 1,
  Error: 2,
} as const;

export type LogType = (typeof LogType)[keyof typeof LogType];

export type LogEntry = {
  type: LogType;
  message: string;
  timestamp: Date;
};
