import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/dataframe_select_column.py';

export const DATAFRAME_SELECT_COLUMN = 'dataframe_select_column';

Blockly.Blocks[DATAFRAME_SELECT_COLUMN] = {
  init: function () {
    this.appendDummyInput()
      .appendField('DataFrame')
      .appendField(new Blockly.FieldVariable('df'), 'df');
    this.appendValueInput('column')
      .appendField('の列')
      .setCheck(VariableTypes.String);
    this.setOutput(true);
    this.setColour(260);
    this.setInputsInline(true);
  },
};

pythonGenerator.forBlock[DATAFRAME_SELECT_COLUMN] = (block, generator) => {
  const df = block.getField('df')?.getText() || 'df';
  const target = generator.valueToCode(block, 'column', Order.NONE) || '""';
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
    __BLOCKLY_column__: target,
  });
  return `${code}\n`;
};
