import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import transformTemplate from './template/sklearn_transform.py';

export const SKLEARN_TRANSFORM = 'sklearn_transform';

Blockly.Blocks[SKLEARN_TRANSFORM] = {
  init: function () {
    this.appendValueInput('OBJECT')
      .setCheck([VariableTypes.Transformer, VariableTypes.Pipeline])
      .appendField('オブジェクト');
    this.appendValueInput('X_DATA')
      .setCheck(VariableTypes.Dataframe)
      .appendField('をデータXに適用して変換');
    this.setInputsInline(true);
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(30);
    this.setTooltip('指定したオブジェクトをデータXに適用して変換します。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_TRANSFORM] = (block, generator) => {
  const object = generator.valueToCode(block, 'OBJECT', Order.NONE) || 'None';
  const xData = generator.valueToCode(block, 'X_DATA', Order.NONE) || 'None';

  const body = stripImports(transformTemplate, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_object__: object,
    __BLOCKLY_x_data__: xData,
  });
  return [code, Order.FUNCTION_CALL];
};
