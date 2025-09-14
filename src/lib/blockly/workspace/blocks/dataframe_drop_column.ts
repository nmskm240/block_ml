import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/dataframe_drop_column.py';

export const DATAFRAME_DROP_COLUMN = 'dataframe_drop_column';

Blockly.Blocks[DATAFRAME_DROP_COLUMN] = {
  init(): void {
    this.appendDummyInput()
      .appendField('DataFrame')
      .appendField(new Blockly.FieldVariable('df'), 'df');
    this.appendValueInput('columns')
      .appendField('の列')
      .setCheck([VariableTypes.Array, VariableTypes.String]);
    this.appendDummyInput().appendField('を削除する');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(210);
    this.setTooltip('');
  },
};

pythonGenerator.forBlock[DATAFRAME_DROP_COLUMN] = (block, generator) => {
  const df = block.getField('df')?.getText() || 'df';
  let columns = generator.valueToCode(block, 'columns', Order.NONE) || '[]';
  columns = columns.startsWith('[') ? columns : `[${columns}]`;

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
    __BLOCKLY_columns__: columns,
  });
  return `${code}\n`;
};
