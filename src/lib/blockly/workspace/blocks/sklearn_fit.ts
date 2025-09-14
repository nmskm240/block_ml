import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import fitTemplate from './template/sklearn_fit.py';

export const SKLEARN_FIT = 'sklearn_fit';

enum Args {
  X = 'X_DATA',
  Y = 'Y_DATA',
  Model = 'MODEL',
}

Blockly.Blocks[SKLEARN_FIT] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('学習機')
      .appendField(new Blockly.FieldVariable('pipeline'), Args.Model)
      .appendField('で');
    this.appendValueInput(Args.X)
      .appendField('特徴量')
      .setCheck(VariableTypes.Dataframe)
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'X' }));
    this.appendValueInput(Args.Y)
      .appendField(', 目的変数')
      .setCheck(VariableTypes.Dataframe)
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'y' }));
    this.appendDummyInput().appendField('を学習させる');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(100);
    this.setTooltip('指定した学習器をデータXとデータYで学習させます。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_FIT] = (block, generator) => {
  const object = block.getField(Args.Model)!.getText();
  const xData = generator.valueToCode(block, Args.X, Order.NONE);
  const yData = generator.valueToCode(block, Args.Y, Order.NONE);

  const body = stripImports(fitTemplate, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_object__: object,
    __BLOCKLY_x_data__: xData,
    __BLOCKLY_y_data__: yData,
  });
  return `${code}\n`;
};
