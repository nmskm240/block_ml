'use client';

import React from 'react';

import Plot from 'react-plotly.js';

import { PlotlyFigure } from '@/lib/plotly/types';

type Props = {
  figure: PlotlyFigure;
};

export function PlotlyGraph({ figure }: Props) {
  return (
    <Plot
      data={figure.data}
      layout={figure.layout}
      style={{ width: '100%', height: '400px' }}
      useResizeHandler
    />
  );
}
