import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnTransformerDropdown } from '../fields';
import { VariableTypes, SklearnTransformerType } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import minMaxScalerTemplate from './template/sklearn_select_transformer/min_max_scaler.py';
import standardScalerTemplate from './template/sklearn_select_transformer/standard_scaler.py';

export const SKLEARN_SELECT_TRANSFORMER = 'sklearn_select_transformer';

Blockly.Blocks[SKLEARN_SELECT_TRANSFORMER] = {
  init: function () {
    this.appendDummyInput()
      .appendField('変換器を作成')
      .appendField(new SklearnTransformerDropdown(), 'type');
    this.setOutput(true, VariableTypes.Transformer);
    this.setColour(230);
    this.setTooltip('指定した変換器を作成します');
  },
};

pythonGenerator.forBlock[SKLEARN_SELECT_TRANSFORMER] = (block, generator) => {
  const type = block.getFieldValue('type') as SklearnTransformerType;
  const template = match(type)
    .with(SklearnTransformerType.StandardScaler, () => standardScalerTemplate)
    .with(SklearnTransformerType.MinMaxScaler, () => minMaxScalerTemplate)
    .exhaustive();
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {});
  return [code, Order.FUNCTION_CALL];
};
