import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import template from './template/sklearn_predict.py';

export const SKLEARN_PREDICT = 'sklearn_predict';

enum Args {
  X = 'X',
  Model = 'MODEL',
}

Blockly.Blocks[SKLEARN_PREDICT] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('学習器')
      .appendField(new Blockly.FieldVariable('pipeline'), Args.Model)
      .appendField('で');
    this.appendValueInput(Args.X)
      .appendField('特徴量')
      .setCheck(VariableTypes.Dataframe)
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'X' }));
    this.appendDummyInput()
      .appendField("から予測する")
    this.setOutput(true, VariableTypes.Dataframe);
    this.setInputsInline(true);
    this.setColour(220);
    this.setTooltip('学習済みの学習器を使用して予測を行います。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_PREDICT] = (block, generator) => {
  const model = block.getField(Args.Model)!.getText();
  const xData = generator.valueToCode(block, Args.X, Order.NONE);

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_model__: model,
    __BLOCKLY_x_data__: xData,
  });

  return [code, Order.FUNCTION_CALL];
};
