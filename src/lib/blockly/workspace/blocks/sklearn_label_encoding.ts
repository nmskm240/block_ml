import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/sklearn_label_encoding.py';

export const SKLEARN_LABEL_ENCODING = 'sklearn_label_encoding';

Blockly.Blocks[SKLEARN_LABEL_ENCODING] = {
  init: function () {
    this.appendDummyInput()
      .appendField('DataFrame')
      .appendField(new Blockly.FieldVariable('df'), 'df')
      .appendField('を');
    this.appendValueInput('column')
      .setCheck(VariableTypes.String)
      .appendField('の列');
    this.appendDummyInput().appendField('をラベルエンコーディングする');
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(120);
    this.setTooltip(
      '指定したデータフレームの列をラベルエンコーディングします。',
    );
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_LABEL_ENCODING] = (block, generator) => {
  const df = (block.getFieldValue('df') as string) ?? 'df';
  const column = generator.valueToCode(block, 'column', Order.NONE) || "''";
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
    __BLOCKLY_column__: column,
  });
  return [code, Order.FUNCTION_CALL];
};
