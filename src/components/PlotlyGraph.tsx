'use client';

import React from 'react';

import dynamic from 'next/dynamic';

import { PlotlyFigure } from '@/lib/plotly/types';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type Props = {
  figure: PlotlyFigure;
};

export function PlotlyGraph({ figure }: Props) {
  return (
    <Plot
      data={figure.data}
      layout={{
        ...figure.layout,
        margin: { t: 30, r: 5, b: 0, l: 5 },
        autosize: true,
      }}
      style={{ height: '400px' }}
    />
  );
}
