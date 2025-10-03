import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import template from './template/dataframe_drop_column.py';

export const DATAFRAME_DROP_COLUMN = 'dataframe_drop_column';

enum Args {
  DataFrame = 'DATAFRAME',
  Columns = 'COLUMNS',
}

Blockly.Blocks[DATAFRAME_DROP_COLUMN] = {
  init(this: Blockly.Block): void {
    this.appendValueInput(Args.DataFrame)
      .appendField('DataFrame')
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'df' }))
      .setCheck(VariableTypes.Dataframe);
    this.appendValueInput(Args.Columns)
      .appendField('の列')
      .setShadowDom(createShadowBlock('text'))
      .setCheck([VariableTypes.Array, VariableTypes.String]);
    this.appendDummyInput().appendField('を削除する');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(210);
    this.setTooltip('');
  },
};

pythonGenerator.forBlock[DATAFRAME_DROP_COLUMN] = (block, generator) => {
  const df = generator.valueToCode(block, Args.DataFrame, Order.NONE);
  let columns = generator.valueToCode(block, Args.Columns, Order.NONE);
  columns = columns.startsWith('[') ? columns : `[${columns}]`;

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
    __BLOCKLY_columns__: columns,
  });
  return `${code}\n`;
};
