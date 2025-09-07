import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { FillMissingStrategyDropdown } from '../fields';
import { VariableTypes } from '../types';
import {
  applyPlaceholders as replacePlaceholders,
  stripImports,
} from '../utils';
import template from './template/dataframe_fill_missing.py';

export const DATAFRAME_FILL_MISSING = 'dataframe_fill_missing';

Blockly.Blocks[DATAFRAME_FILL_MISSING] = {
  init: function () {
    this.appendDummyInput()
      .appendField('DataFrame')
      .appendField(new Blockly.FieldVariable('df'), 'df')
      .appendField('の欠損値を')
      .appendField(new FillMissingStrategyDropdown(), 'strategy')
      .appendField('で補完する');
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(230);
    this.setTooltip('指定したデータフレームの欠損値を補完します。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[DATAFRAME_FILL_MISSING] = (block, generator) => {
  const df = block.getField('df')?.getText() || 'df';
  const strategy = block.getFieldValue('strategy');
  const body = stripImports(template, generator);
  const code = replacePlaceholders(body, {
    __BLOCKLY_df__: df,
    __BLOCKLY_strategy__: `'${strategy}'`,
  });
  return [code, Order.FUNCTION_CALL];
};
