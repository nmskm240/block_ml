import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import template from './template/plotly_get_traces.py';

export const PLOTLY_GET_TRACES = 'plotly_get_traces';

enum Args {
  Figure = 'FIGURE',
  Trace = 'TRACE',
}

Blockly.Blocks[PLOTLY_GET_TRACES] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput(Args.Figure)
      .appendField('グラフ')
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'fig' }))
      .setCheck(VariableTypes.Figure);
    this.appendDummyInput().appendField('のデータ');
    this.setOutput(true, VariableTypes.Trace);
    this.setColour(210);
    this.setTooltip('指定したグラフのデータを取得');
  },
};

pythonGenerator.forBlock[PLOTLY_GET_TRACES] = (block, generator) => {
  const fig = generator.valueToCode(block, Args.Figure, Order.NONE);

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_FIGURE__: fig,
  });

  return [code, Order.MEMBER];
};
