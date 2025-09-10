import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnDiscretizerDropdown } from '../fields';
import { VariableTypes, SklearnDiscretizerType } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import binarizerTemplate from './template/sklearn_select_discretizer/binarizer.py';
import kbinsDiscretizerTemplate from './template/sklearn_select_discretizer/kbins_discretizer.py';

export const SKLEARN_SELECT_DISCRETIZER = 'sklearn_select_discretizer';

Blockly.Blocks[SKLEARN_SELECT_DISCRETIZER] = {
  init: function () {
    this.appendDummyInput()
      .appendField('離散化を作成')
      .appendField(new SklearnDiscretizerDropdown(), 'type');
    this.setOutput(true, VariableTypes.Transformer);
    this.setColour(200);
    this.setTooltip('指定した離散化を作成します');
  },
};

pythonGenerator.forBlock[SKLEARN_SELECT_DISCRETIZER] = (block, generator) => {
  const type = block.getFieldValue('type') as SklearnDiscretizerType;
  const template = match(type)
    .with(SklearnDiscretizerType.Binarizer, () => binarizerTemplate)
    .with(SklearnDiscretizerType.KBinsDiscretizer, () => kbinsDiscretizerTemplate)
    .exhaustive();
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {});
  return [code, Order.FUNCTION_CALL];
};
