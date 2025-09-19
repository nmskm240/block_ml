import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import template from './template/dataframe_get_columns.py';

export const DATAFRAME_GET_COLUMNS = 'dataframe_get_columns';

Blockly.Blocks[DATAFRAME_GET_COLUMNS] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('df')
      .setCheck(VariableTypes.Dataframe)
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'df' }));
    this.appendDummyInput().appendField('の列名');
    this.setOutput(true, VariableTypes.Array);
    this.setColour(210);
    this.setTooltip('DataFrameのすべての列名をリストとして返します。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[DATAFRAME_GET_COLUMNS] = (block, generator) => {
  const df = generator.valueToCode(block, 'df', Order.NONE) || 'df';

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
  });

  return [code, Order.FUNCTION_CALL];
};
