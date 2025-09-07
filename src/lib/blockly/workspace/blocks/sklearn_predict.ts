import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/sklearn_predict.py';

export const SKLEARN_PREDICT = 'sklearn_predict';

Blockly.Blocks[SKLEARN_PREDICT] = {
  init: function () {
    this.appendDummyInput('model')
      .appendField(new Blockly.FieldVariable('model'), 'model')
      .setCheck(VariableTypes.Model)
      .appendField('学習済みモデル');
    this.appendValueInput('X')
      .setCheck(VariableTypes.Dataframe)
      .appendField('で、次のデータを予測');
    this.setOutput(true, VariableTypes.Dataframe);
    this.setInputsInline(true);
    this.setColour(230);
    this.setTooltip('学習済みのモデルを使用して予測を行います。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_PREDICT] = (block, generator) => {
  const model = (block.getFieldValue('model') as string) || 'model';
  const x = generator.valueToCode(block, 'X', Order.NONE) || 'x';

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_model__: model,
    __BLOCKLY_x__: x,
  });

  return [code, Order.FUNCTION_CALL];
};
