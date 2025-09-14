import * as Blockly from 'blockly/core';

import { SklearnScalerType } from '../types';

export class SklearnScalerDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['StandardScaler', SklearnScalerType.StandardScaler],
      ['MinMaxScaler', SklearnScalerType.MinMaxScaler],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_scaler_dd', SklearnScalerDropdown);
