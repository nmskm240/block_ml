import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnNormalizerDropdown } from '../fields';
import { VariableTypes, SklearnNormalizerType } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import l1NormalizerTemplate from './template/sklearn_select_normalizer/l1_normalizer.py';
import l2NormalizerTemplate from './template/sklearn_select_normalizer/l2_normalizer.py';

export const SKLEARN_SELECT_NORMALIZER = 'sklearn_select_normalizer';

Blockly.Blocks[SKLEARN_SELECT_NORMALIZER] = {
  init: function () {
    this.appendDummyInput()
      .appendField('正規化を作成')
      .appendField(new SklearnNormalizerDropdown(), 'type');
    this.setOutput(true, VariableTypes.Transformer);
    this.setColour(200);
    this.setTooltip('指定した正規化を作成します');
  },
};

pythonGenerator.forBlock[SKLEARN_SELECT_NORMALIZER] = (block, generator) => {
  const type = block.getFieldValue('type') as SklearnNormalizerType;
  const template = match(type)
    .with(SklearnNormalizerType.L1, () => l1NormalizerTemplate)
    .with(SklearnNormalizerType.L2, () => l2NormalizerTemplate)
    .exhaustive();
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {});
  return [code, Order.FUNCTION_CALL];
};
