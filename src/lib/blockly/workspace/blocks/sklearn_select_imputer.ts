import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { FillMissingStrategyDropdown } from '../fields';
import { VariableTypes } from '../types';
import {
  applyPlaceholders as replacePlaceholders,
  stripImports,
} from '../utils';
import template from './template/sklearn_select_imputer.py';

export const SKLEARN_SELECT_IMPUTER = 'sklearn_select_imputer';

Blockly.Blocks[SKLEARN_SELECT_IMPUTER] = {
  init: function () {
    this.appendDummyInput()
      .appendField('欠損値を')
      .appendField(new FillMissingStrategyDropdown(), 'strategy')
      .appendField('で補完する');
    this.setOutput(true, VariableTypes.Transformer);
    this.setColour(200);
    this.setTooltip('欠損値を補完します。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_SELECT_IMPUTER] = (block, generator) => {
  const strategy = block.getFieldValue('strategy');
  const body = stripImports(template, generator);
  const code = replacePlaceholders(body, {
    __BLOCKLY_STRATEGY__: strategy,
  });
  return [code, Order.FUNCTION_CALL];
};
