import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnEncoderDropdown } from '../fields';
import { VariableTypes, SklearnEncoderType } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import oneHotEncoderTemplate from './template/sklearn_select_encoder/one_hot_encoder.py';
import labelEncoderTemplate from './template/sklearn_select_encoder/label_encoder.py';

export const SKLEARN_SELECT_ENCODER = 'sklearn_select_encoder';

Blockly.Blocks[SKLEARN_SELECT_ENCODER] = {
  init: function () {
    this.appendDummyInput()
      .appendField('エンコーダーを作成')
      .appendField(new SklearnEncoderDropdown(), 'type');
    this.setOutput(true, VariableTypes.Transformer);
    this.setColour(230);
    this.setTooltip('指定したエンコーダーを作成します');
  },
};

pythonGenerator.forBlock[SKLEARN_SELECT_ENCODER] = (block, generator) => {
  const type = block.getFieldValue('type') as SklearnEncoderType;
  const template = match(type)
    .with(SklearnEncoderType.OneHotEncoder, () => oneHotEncoderTemplate)
    .with(SklearnEncoderType.LabelEncoder, () => labelEncoderTemplate)
    .exhaustive();
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {});
  return [code, Order.FUNCTION_CALL];
};
