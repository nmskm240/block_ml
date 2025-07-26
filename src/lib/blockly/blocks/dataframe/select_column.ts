import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';
import { VariableTypes } from '../../types/variables';

export const DATA_FRAME_SELECT_COLUMN = 'dataframe_select_column';

Blockly.Blocks[DATA_FRAME_SELECT_COLUMN] = {
  init: function () {
    this.appendDummyInput('')
      .appendField('DataFrame')
      .appendField(new Blockly.FieldVariable('df'));
    this.appendValueInput('column')
      .appendField('の列')
      .setCheck(VariableTypes.String);
    this.setOutput(true);
    this.setColour(260);
    this.setInputsInline(true);
  },
};

pythonGenerator.forBlock[DATA_FRAME_SELECT_COLUMN] = (block, generator) => {
  const df = block.getField('df')?.getText() || 'df';
  let target = generator.valueToCode(block, 'column', Order.NONE) || '""';
  return [`${df}[${target}]`, Order.ATOMIC];
};
