import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { VariableTypes } from '../../../types/variables';

export const DATA_FRAME_FILTER_BLOCK_KEY = 'filter_block';

Blockly.Blocks[DATA_FRAME_FILTER_BLOCK_KEY] = {
  init: function () {
    this.appendDummyInput('')
      .appendField('DataFrame')
      .appendField(new Blockly.FieldVariable('df'), 'df')
      .appendField('から');
    this.appendValueInput('Condition')
      .setCheck(VariableTypes.Boolean)
      .appendField('条件に合う行');
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(260);
    this.setTooltip('');
    this.setInputsInline(true);
  },
};

pythonGenerator.forBlock[DATA_FRAME_FILTER_BLOCK_KEY] = (block, generator) => {
  const df = block.getField('df')?.getText() || 'df';
  const condition =
    generator.valueToCode(block, 'Condition', Order.NONE) || true;

  return [`${df}[${condition}]`, Order.ATOMIC];
};
