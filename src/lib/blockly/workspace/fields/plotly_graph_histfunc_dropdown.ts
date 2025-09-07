import * as Blockly from 'blockly/core';

import { PlotlyGraphHistfuncType } from '../types';

export class PlotlyGraphHistfuncDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['count', PlotlyGraphHistfuncType.Count],
      ['sum', PlotlyGraphHistfuncType.Sum],
      ['avg', PlotlyGraphHistfuncType.Avg],
      ['min', PlotlyGraphHistfuncType.Min],
      ['max', PlotlyGraphHistfuncType.Max],
    ]);
  }
}

Blockly.fieldRegistry.register(
  'plotly_graph_histfunc_dd',
  PlotlyGraphHistfuncDropdown,
);
