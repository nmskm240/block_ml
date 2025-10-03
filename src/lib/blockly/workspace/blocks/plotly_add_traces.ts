import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import template from './template/plotly_add_traces.py';

export const PLOTLY_ADD_TRACES = 'plotly_add_traces';

enum Args {
  Figure = 'FIGURE',
  Trace = 'TRACE',
}

Blockly.Blocks[PLOTLY_ADD_TRACES] = {
  init: function () {
    this.appendValueInput(Args.Figure)
      .appendField('グラフ')
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'fig' }))
      .setCheck(VariableTypes.Figure);
    this.appendValueInput(Args.Trace)
      .appendField('に、グラフ')
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'trace' }))
      .setCheck(VariableTypes.Trace);
    this.appendDummyInput().appendField('のデータを追加');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip(
      '指定したグラフに、別のグラフのデータを追加して重ね合わせます。',
    );
  },
};

pythonGenerator.forBlock[PLOTLY_ADD_TRACES] = (block, generator) => {
  const fig = generator.valueToCode(block, Args.Figure, Order.NONE);
  const trace = generator.valueToCode(block, Args.Trace, Order.NONE);

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_FIGURE__: fig,
    __BLOCKLY_TRACE__: trace,
  });

  return `${code}\n`;
};
