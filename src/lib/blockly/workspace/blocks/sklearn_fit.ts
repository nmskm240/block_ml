import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import fitTemplate from './template/sklearn_fit.py';

export const SKLEARN_FIT = 'sklearn_fit';

Blockly.Blocks[SKLEARN_FIT] = {
  init: function () {
    this.appendValueInput('OBJECT')
      .setCheck([
        VariableTypes.Model,
        VariableTypes.Transformer,
        VariableTypes.Pipeline,
      ])
      .appendField('オブジェクト');
    this.appendValueInput('X_DATA')
      .setCheck(VariableTypes.Dataframe)
      .appendField('をデータX');
    this.appendValueInput('Y_DATA')
      .setCheck(VariableTypes.Dataframe)
      .appendField('とデータYで学習');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(100);
    this.setTooltip('指定したオブジェクトをデータXとデータYで学習させます。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_FIT] = (block, generator) => {
  const object = generator.valueToCode(block, 'OBJECT', Order.NONE) || 'None';
  const xData = generator.valueToCode(block, 'X_DATA', Order.NONE) || 'None';
  const yData = generator.valueToCode(block, 'Y_DATA', Order.NONE) || 'None';

  const body = stripImports(fitTemplate, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_object__: object,
    __BLOCKLY_x_data__: xData,
    __BLOCKLY_y_data__: yData,
  });
  return `${code}\n`;
};
