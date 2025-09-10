import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/sklearn_predict.py';

export const SKLEARN_PREDICT = 'sklearn_predict';

Blockly.Blocks[SKLEARN_PREDICT] = {
  init: function () {
    this.appendValueInput('MODEL')
      .setCheck([VariableTypes.Model, VariableTypes.Pipeline])
      .appendField('モデル');
    this.appendValueInput('X_DATA')
      .setCheck(VariableTypes.Dataframe)
      .appendField('で、データXを予測');
    this.setOutput(true, VariableTypes.Dataframe);
    this.setInputsInline(true);
    this.setColour(230);
    this.setTooltip('学習済みのモデルを使用して予測を行います。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_PREDICT] = (block, generator) => {
  const model = generator.valueToCode(block, 'MODEL', Order.ATOMIC) || 'None';
  const xData = generator.valueToCode(block, 'X_DATA', Order.NONE) || 'None';

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_model__: model,
    __BLOCKLY_x_data__: xData,
  });

  return [code, Order.FUNCTION_CALL];
};
