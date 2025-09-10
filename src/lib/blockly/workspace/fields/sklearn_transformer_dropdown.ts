import * as Blockly from 'blockly/core';

import { SklearnTransformerType } from '../types';

export class SklearnTransformerDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['標準化', SklearnTransformerType.StandardScaler],
      ['正規化', SklearnTransformerType.MinMaxScaler],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_transformer_dd', SklearnTransformerDropdown);
