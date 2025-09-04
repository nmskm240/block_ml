import { PlotlyFigure } from '@/lib/plotly/types';

export enum LogType {
  None,
  Out,
  Error,
}

export type LogMessage = {
  type: LogType;
  message: string;
};

export type Entry = {
  id: string;
  timestamp: Date;
  content:
    | { type: 'log'; payload: LogMessage }
    | { type: 'graph'; payload: PlotlyFigure };
};
