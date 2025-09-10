import * as Blockly from 'blockly/core';

import { SklearnRegressionModelType } from '../types';

export class SklearnRegressionModelDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['線形回帰', SklearnRegressionModelType.LinearRegression],
      ['SVR', SklearnRegressionModelType.SVR],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_regression_model_dd', SklearnRegressionModelDropdown);
