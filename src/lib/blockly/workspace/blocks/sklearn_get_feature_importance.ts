import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import template from './template/sklearn_get_feature_importance.py';

export const SKLEARN_GET_FEATURE_IMPORTANCE = 'sklearn_get_feature_importance';

enum Args {
  Model = 'MODEL',
  X = 'X',
  Y = 'Y',
}

Blockly.Blocks[SKLEARN_GET_FEATURE_IMPORTANCE] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('学習器')
      .appendField(new Blockly.FieldVariable('pipeline'), Args.Model);
    this.appendValueInput(Args.X)
      .appendField('で特徴量')
      .setCheck(VariableTypes.Dataframe)
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'X_test' }));
    this.appendValueInput(Args.Y)
      .appendField('、ターゲット')
      .setCheck(VariableTypes.Dataframe)
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'y_test' }));
    this.appendDummyInput().appendField('の重要度を計算する');
    this.setInputsInline(true);
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(350);
    this.setTooltip(
      'Permutation Importanceを用いて特徴量の重要度を計算し、DataFrameとして返します。',
    );
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_GET_FEATURE_IMPORTANCE] = (
  block,
  generator,
) => {
  const model = block.getField(Args.Model)!.getText();
  const xData = generator.valueToCode(block, Args.X, Order.NONE);
  const yData = generator.valueToCode(block, Args.Y, Order.NONE);

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_model__: model,
    __BLOCKLY_x_data__: xData,
    __BLOCKLY_y_data__: yData,
  });

  return [code, Order.FUNCTION_CALL];
};
