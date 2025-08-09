import * as Blockly from 'blockly/core';
import { pythonGenerator, Order } from 'blockly/python';

export const SK_LEARN_FIT_MODEL = 'sk_learn_predicate';

Blockly.Blocks[SK_LEARN_FIT_MODEL] = {
  init: function () {
    this.appendDummyInput('')
      .appendField('モデル')
      .appendField(new Blockly.FieldVariable('model'), 'model')
      .appendField('を');
    this.appendDummyInput('')
      .appendField('学習データ')
      .appendField(new Blockly.FieldVariable('X'), 'X');
    this.appendDummyInput('')
      .appendField('正解データ')
      .appendField(new Blockly.FieldVariable('Y'), 'Y');
    this.appendDummyInput('').appendField('で学習させる');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(120);
  },
};

pythonGenerator.forBlock[SK_LEARN_FIT_MODEL] = (block, generator) => {
  const varName = block.getField('model')?.getText() || 'model';
  const xCode = block.getField('X')?.getText() || 'X';
  const yCode = block.getField('Y')?.getText() || 'y';
  return `${varName}.fit(${xCode}, ${yCode})\n`;
};
