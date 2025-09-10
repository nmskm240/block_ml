import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { SklearnCustomTransformerDropdown } from '../fields';
import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/sklearn_custom_transformer.py';

export const SKLEARN_CUSTOM_TRANSFORMER = 'sklearn_custom_transformer';

Blockly.Blocks[SKLEARN_CUSTOM_TRANSFORMER] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('カスタム変換器')
      .appendField(new SklearnCustomTransformerDropdown(), 'FUNC');
    this.setOutput(true, VariableTypes.Transformer);
    this.setColour(30);
    this.setTooltip('FunctionTransformer に渡す関数を選択');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_CUSTOM_TRANSFORMER] = (block, generator) => {
  const funcName = block.getFieldValue('FUNC');
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_func_name__: funcName,
  });
  return [code, Order.ATOMIC];
};
