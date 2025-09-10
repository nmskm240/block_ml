import * as Blockly from 'blockly/core';

import { SklearnEncoderType } from '../types';

export class SklearnEncoderDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['One-Hotエンコーディング', SklearnEncoderType.OneHotEncoder],
      ['ラベルエンコーディング', SklearnEncoderType.LabelEncoder],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_encoder_dd', SklearnEncoderDropdown);
