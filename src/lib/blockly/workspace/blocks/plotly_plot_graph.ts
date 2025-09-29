import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';
import { match } from 'ts-pattern';

import { PlotlyGraphDropdown, PlotlyGraphHistfuncDropdown } from '../fields';
import {
  PlotlyGraphHistfuncType,
  PlotlyGraphType,
  VariableTypes,
} from '../types';
import {
  applyPlaceholders,
  createShadowBlock,
  stripDefinitions,
  stripImports,
} from '../utils';
import barTemplate from './template/plotly_plot_graph/bar.py';
import boxTemplate from './template/plotly_plot_graph/box.py';
import histogramTemplate from './template/plotly_plot_graph/histogram.py';
import lineTemplate from './template/plotly_plot_graph/line.py';
import scatterTemplate from './template/plotly_plot_graph/scatter.py';

export const PLOTLY_PLOT_GRAPH = 'plotly_plot_graph';

type PlotGraphBlock = Blockly.Block & {
  updateShape_: (this: PlotGraphBlock) => void;
};

enum Args {
  DataFrame = 'DATAFRAME',
  Title = 'TITLE',
  X = 'X',
  Y = 'Y',
  Type = 'TYPE',
  HistFunc = 'HIST_FUNC',
}

Blockly.Blocks[PLOTLY_PLOT_GRAPH] = {
  init: function (this: PlotGraphBlock) {
    this.appendValueInput(Args.DataFrame)
      .appendField('グラフ作成')
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'df' }))
      .setCheck(VariableTypes.Dataframe);
    this.appendDummyInput()
      .appendField('タイトル')
      .appendField(new Blockly.FieldTextInput('グラフ'), Args.Title)
      .appendField('x列')
      .appendField(new Blockly.FieldTextInput('x'), Args.X)
      .appendField('y列')
      .appendField(new Blockly.FieldTextInput('y'), Args.Y)
      .appendField('種類')
      .appendField(new PlotlyGraphDropdown(), Args.Type);
    this.setOutput(true, VariableTypes.Figure);
    this.setColour(210);
    this.setTooltip('指定された列でグラフを作成');

    this.updateShape_();
  },
  onchange: function (event: Blockly.Events.BlockChange) {
    if (event.blockId === this.id) {
      if (event.name === Args.Type) {
        this.updateShape_();
      }
    }
  },
  updateShape_: function (this: PlotGraphBlock) {
    const type = this.getFieldValue(Args.Type);

    if (type === PlotlyGraphType.Histogram) {
      if (!this.getField(Args.HistFunc)) {
        this.appendDummyInput('histfunc_input')
          .appendField('集計方法')
          .appendField(new PlotlyGraphHistfuncDropdown(), Args.HistFunc);
      }
    } else {
      if (this.getInput('histfunc_input')) {
        this.removeInput('histfunc_input');
      }
    }
  },
};

pythonGenerator.forBlock[PLOTLY_PLOT_GRAPH] = (block, generator) => {
  const df = generator.valueToCode(block, Args.DataFrame, Order.NONE);
  const title = block.getFieldValue(Args.Title);
  const x = block.getFieldValue(Args.X);
  const y = block.getFieldValue(Args.Y);
  const type = block.getFieldValue(Args.Type) as PlotlyGraphType;
  const histfunc =
    type === PlotlyGraphType.Histogram
      ? (block.getFieldValue(Args.HistFunc) as PlotlyGraphHistfuncType) ||
        PlotlyGraphHistfuncType.Count
      : '';

  const template = match(type)
    .with(PlotlyGraphType.Bar, () => barTemplate)
    .with(PlotlyGraphType.Box, () => boxTemplate)
    .with(PlotlyGraphType.Histogram, () => histogramTemplate)
    .with(PlotlyGraphType.Line, () => lineTemplate)
    .with(PlotlyGraphType.Scatter, () => scatterTemplate)
    .exhaustive();
  let body = stripImports(template, generator);
  body = stripDefinitions(body, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
    __BLOCKLY_x__: x,
    __BLOCKLY_y__: y,
    __BLOCKLY_title__: title,
    __BLOCKLY_histfunc__: histfunc,
  });

  return [code, Order.FUNCTION_CALL];
};
