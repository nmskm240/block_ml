import * as Blockly from 'blockly/core';

import { SklearnEncoderType } from '../types';

export class SklearnEncoderDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['LabelEncoder', SklearnEncoderType.LabelEncoder],
      ['OneHotEncoder', SklearnEncoderType.OneHotEncoder],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_encoder_dd', SklearnEncoderDropdown);
