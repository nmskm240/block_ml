import * as Blockly from 'blockly/core';

import { PlotlyGraphType } from '../types';

export class PlotlyGraphDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['棒グラフ', PlotlyGraphType.Bar],
      ['箱ひげ図', PlotlyGraphType.Box],
      ['ヒストグラム', PlotlyGraphType.Histogram],
      ['折れ線', PlotlyGraphType.Line],
      ['散布図', PlotlyGraphType.Scatter],
    ]);
  }
}

Blockly.fieldRegistry.register('plotly_graph_dd', PlotlyGraphDropdown);
