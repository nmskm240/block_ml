import { z } from 'zod';

import { JsonFromString } from '@/lib/zod/utils';

const BasePlotlyFigureSchema = z.object({
  data: z.array(z.any()),
  layout: z.record(z.string(), z.any()),
});

export const PlotlyFigureSchema = JsonFromString.pipe(BasePlotlyFigureSchema);

export type PlotlyFigure = z.infer<typeof BasePlotlyFigureSchema>;
