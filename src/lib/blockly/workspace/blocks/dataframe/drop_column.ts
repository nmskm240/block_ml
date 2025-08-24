import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../../../types/variables';

export const DATA_FRAME_DROP_COLUMN_KEY = 'dataframe_column_drop';

Blockly.Blocks[DATA_FRAME_DROP_COLUMN_KEY] = {
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
    this.setColour(260);
    this.setTooltip('');
  },
};

pythonGenerator.forBlock[DATA_FRAME_DROP_COLUMN_KEY] = (block, generator) => {
  const df = block.getField('df')?.getText() || 'df';
  let columns = generator.valueToCode(block, 'columns', Order.NONE) || '[]';
  columns = columns.startsWith('[') ? columns : `[${columns}]`;

  return `${df}.drop(columns=${columns}, inplace=True)\n`;
};
