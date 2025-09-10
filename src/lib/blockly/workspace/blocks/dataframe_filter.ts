import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/dataframe_filter.py';

export const DATAFRAME_FILTER = 'filter_block';

Blockly.Blocks[DATAFRAME_FILTER] = {
  init: function () {
    this.appendDummyInput()
      .appendField('DataFrame')
      .appendField(new Blockly.FieldVariable('df'), 'df')
      .appendField('から');
    this.appendValueInput('condition')
      .setCheck(VariableTypes.Boolean)
      .appendField('条件に合う行');
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(210);
    this.setTooltip('');
    this.setInputsInline(true);
  },
};

pythonGenerator.forBlock[DATAFRAME_FILTER] = (block, generator) => {
  const df = block.getField('df')?.getText() || 'df';
  const condition =
    generator.valueToCode(block, 'condition', Order.NONE) || true;
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
    __BLOCKLY_condition__: `${condition}`,
  });
  return [code, Order.FUNCTION_CALL];
};
