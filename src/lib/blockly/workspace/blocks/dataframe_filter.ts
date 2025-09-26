import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import template from './template/dataframe_filter.py';

export const DATAFRAME_FILTER = 'filter_block';

enum Args {
  DataFrame = 'DATAFRAME',
  Condition = 'CONDITION',
}

Blockly.Blocks[DATAFRAME_FILTER] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput(Args.DataFrame)
      .appendField('DataFrame')
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'df' }))
      .setCheck(VariableTypes.Dataframe);
    this.appendDummyInput().appendField('から');
    this.appendValueInput(Args.Condition)
      .appendField('条件')
      .setCheck(VariableTypes.Boolean)
      .setShadowDom(createShadowBlock('logic_compare'));
    this.appendDummyInput().appendField('に合う行');
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(210);
    this.setTooltip('');
    this.setInputsInline(true);
  },
};

pythonGenerator.forBlock[DATAFRAME_FILTER] = (block, generator) => {
  const df = generator.valueToCode(block, Args.DataFrame, Order.NONE);
  const condition = generator.valueToCode(block, Args.Condition, Order.NONE);
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
    __BLOCKLY_condition__: `${condition}`,
  });
  return [code, Order.FUNCTION_CALL];
};
