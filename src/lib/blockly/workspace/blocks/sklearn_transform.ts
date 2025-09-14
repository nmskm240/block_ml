import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import transformTemplate from './template/sklearn_transform.py';

export const SKLEARN_TRANSFORM = 'sklearn_transform';

enum Args {
  X = 'X',
  Pipeline = 'PIPELINE',
}

Blockly.Blocks[SKLEARN_TRANSFORM] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('学習器')
      .appendField(new Blockly.FieldVariable('pipeline'), Args.Pipeline)
      .appendField('で');
    this.appendValueInput(Args.X)
      .appendField('データ')
      .setCheck(VariableTypes.Dataframe)
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'X' }));
    this.appendDummyInput().appendField('を変換する');
    this.setInputsInline(true);
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(30);
    this.setTooltip('学習器でデータXを変換します。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_TRANSFORM] = (block, generator) => {
  const transformer = block.getField(Args.Pipeline)!.getText();
  const x = generator.valueToCode(block, Args.X, Order.NONE);

  const body = stripImports(transformTemplate, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_transformer__: transformer,
    __BLOCKLY_x__: x,
  });
  return [code, Order.FUNCTION_CALL];
};
