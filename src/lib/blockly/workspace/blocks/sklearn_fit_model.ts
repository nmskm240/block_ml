import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';

import { applyPlaceholders, stripImports } from '../utils';
import template from './template/sklearn_fit_model.py';

export const SKLEARN_FIT_MODEL = 'sklearn_fit_model';

Blockly.Blocks[SKLEARN_FIT_MODEL] = {
  init: function () {
    this.appendDummyInput('')
      .appendField('モデル')
      .appendField(new Blockly.FieldVariable('model'), 'model')
      .appendField('を');
    this.appendDummyInput('')
      .appendField('学習データ')
      .appendField(new Blockly.FieldVariable('x'), 'x');
    this.appendDummyInput('')
      .appendField('正解データ')
      .appendField(new Blockly.FieldVariable('y'), 'y');
    this.appendDummyInput('').appendField('で学習させる');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(120);
  },
};

pythonGenerator.forBlock[SKLEARN_FIT_MODEL] = (block, generator) => {
  const model = block.getField('model')?.getText() || 'model';
  const x = block.getField('x')?.getText() || 'x';
  const y = block.getField('y')?.getText() || 'y';
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_model__: model,
    __BLOCKLY_x__: x,
    __BLOCKLY_y__: y,
  });
  return `${code}\n`;
};
