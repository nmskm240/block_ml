import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import template from './template/dataframe_select_column.py';

export const DATAFRAME_SELECT_COLUMN = 'dataframe_select_column';

enum Args {
  DataFrame = 'DATAFRAME',
  Column = 'COLUMN',
}

Blockly.Blocks[DATAFRAME_SELECT_COLUMN] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput(Args.DataFrame)
      .appendField('DataFrame')
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'df' }))
      .setCheck(VariableTypes.Dataframe);
    this.appendValueInput(Args.Column)
      .appendField('の列')
      .setShadowDom(createShadowBlock('text'))
      .setCheck(VariableTypes.String);
    this.setOutput(true);
    this.setColour(210);
    this.setInputsInline(true);
  },
};

pythonGenerator.forBlock[DATAFRAME_SELECT_COLUMN] = (block, generator) => {
  const df = generator.valueToCode(block, Args.DataFrame, Order.NONE);
  const target = generator.valueToCode(block, Args.Column, Order.NONE);
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
    __BLOCKLY_column__: target,
  });
  return [code, Order.MEMBER];
};
