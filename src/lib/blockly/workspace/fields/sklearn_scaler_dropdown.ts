import * as Blockly from 'blockly/core';

import { SklearnScalerType } from '../types';

export class SklearnScalerDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['標準化', SklearnScalerType.StandardScaler],
      ['正規化', SklearnScalerType.MinMaxScaler],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_scaler_dd', SklearnScalerDropdown);
