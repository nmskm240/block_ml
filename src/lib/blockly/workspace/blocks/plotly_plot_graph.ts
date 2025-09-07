import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';
import { match } from 'ts-pattern';

import { PlotlyGraphDropdown, PlotlyGraphHistfuncDropdown } from '../fields';
import {
  PlotlyGraphHistfuncType,
  PlotlyGraphType,
  VariableTypes,
} from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import barTemplate from './template/plotly_plot_graph/bar.py';
import boxTemplate from './template/plotly_plot_graph/box.py';
import histogramTemplate from './template/plotly_plot_graph/histogram.py';
import lineTemplate from './template/plotly_plot_graph/line.py';
import scatterTemplate from './template/plotly_plot_graph/scatter.py';

export const PLOTLY_PLOT_GRAPH = 'plotly_plot_graph';

Blockly.Blocks[PLOTLY_PLOT_GRAPH] = {
  init: function () {
    this.appendValueInput('df')
      .setCheck(VariableTypes.Dataframe)
      .appendField('グラフ描画');
    this.appendDummyInput()
      .appendField('タイトル')
      .appendField(new Blockly.FieldTextInput('グラフ'), 'title')
      .appendField('x列')
      .appendField(new Blockly.FieldTextInput('x'), 'x')
      .appendField('y列')
      .appendField(new Blockly.FieldTextInput('y'), 'y')
      .appendField('種類')
      .appendField(new PlotlyGraphDropdown(), 'type');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(260);
    this.setTooltip('指定された列でグラフを描画します');

    this.updateShape_();
  },
  onchange: function (event: Blockly.Events.BlockChange) {
    if (
      event.type === Blockly.Events.BLOCK_CHANGE &&
      event.blockId === this.id
    ) {
      if (event.name === 'type') {
        this.updateShape_();
      }
    }
  },
  updateShape_: function () {
    const type = this.getFieldValue('type');

    if (type === PlotlyGraphType.Histogram) {
      if (!this.getField('histfunc')) {
        this.appendDummyInput('histfunc_input')
          .appendField('集計方法')
          .appendField(new PlotlyGraphHistfuncDropdown(), 'histfunc');
      }
    } else {
      if (this.getInput('histfunc_input')) {
        this.removeInput('histfunc_input');
      }
    }
  },
};

pythonGenerator.forBlock[PLOTLY_PLOT_GRAPH] = (block, generator) => {
  const df = generator.valueToCode(block, 'df', Order.NONE) || 'df';
  const title = block.getFieldValue('title');
  const x = block.getFieldValue('x');
  const y = block.getFieldValue('y');
  const type = block.getFieldValue('type') as PlotlyGraphType;
  const histfunc =
    type === PlotlyGraphType.Histogram
      ? (block.getFieldValue('histfunc') as PlotlyGraphHistfuncType) ||
        PlotlyGraphHistfuncType.Count
      : '';

  const template = match(type)
    .with(PlotlyGraphType.Bar, () => barTemplate)
    .with(PlotlyGraphType.Box, () => boxTemplate)
    .with(PlotlyGraphType.Histogram, () => histogramTemplate)
    .with(PlotlyGraphType.Line, () => lineTemplate)
    .with(PlotlyGraphType.Scatter, () => scatterTemplate)
    .exhaustive();
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
    __BLOCKLY_x__: x,
    __BLOCKLY_y__: y,
    __BLOCKLY_title__: title,
    __BLOCKLY_histfunc__: histfunc,
  });

  return `${code}\n`;
};
