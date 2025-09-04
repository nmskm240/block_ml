import { createId } from '@paralleldrive/cuid2';
import { match, P } from 'ts-pattern';

import { PlotlyFigureSchema } from '@/lib/plotly/types';

import { Entry, LogType } from './types';

export function createEntry(message: string, type: LogType): Entry {
  const trimmedMessage = message.trim();
  const id = createId();
  const timestamp = new Date();

  return match([type, trimmedMessage])
    .returnType<Entry>()
    .with(
      [LogType.Out, P.when((msg) => PlotlyFigureSchema.safeParse(msg).success)],
      ([, msg]) => ({
        id,
        timestamp,
        content: {
          type: 'graph',
          payload: PlotlyFigureSchema.parse(msg),
        },
      }),
    )
    .with([LogType.Out, P.string], ([, msg]) => ({
      id,
      timestamp,
      content: {
        type: 'log',
        payload: {
          type: LogType.Out,
          message: msg,
        },
      },
    }))
    .with([LogType.Error, P.string], ([, msg]) => {
      return {
        id,
        timestamp,
        content: {
          type: 'log',
          payload: {
            type: LogType.Error,
            message: msg,
          },
        },
      };
    })
    .otherwise(([, msg]) => ({
      id,
      timestamp,
      content: {
        type: 'log',
        payload: {
          type: LogType.None,
          message: msg,
        },
      },
    }));
}
