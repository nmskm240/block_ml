import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnScalerDropdown } from '../fields';
import { VariableTypes, SklearnScalerType } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import minMaxScalerTemplate from './template/sklearn_select_scaler/min_max_scaler.py';
import standardScalerTemplate from './template/sklearn_select_scaler/standard_scaler.py';

export const SKLEARN_SELECT_SCALER = 'sklearn_select_scaler';

Blockly.Blocks[SKLEARN_SELECT_SCALER] = {
  init: function () {
    this.appendDummyInput()
      .appendField('スケーラーを作成')
      .appendField(new SklearnScalerDropdown(), 'type');
    this.setOutput(true, VariableTypes.Transformer);
    this.setColour(200);
    this.setTooltip('指定したスケーラーを作成します');
  },
};

pythonGenerator.forBlock[SKLEARN_SELECT_SCALER] = (block, generator) => {
  const type = block.getFieldValue('type') as SklearnScalerType;
  const template = match(type)
    .with(SklearnScalerType.StandardScaler, () => standardScalerTemplate)
    .with(SklearnScalerType.MinMaxScaler, () => minMaxScalerTemplate)
    .exhaustive();
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {});
  return [code, Order.FUNCTION_CALL];
};
