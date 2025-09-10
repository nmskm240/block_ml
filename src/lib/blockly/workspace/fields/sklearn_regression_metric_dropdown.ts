import * as Blockly from 'blockly/core';

import { SklearnRegressionMetricType } from '../types';

export class SklearnRegressionMetricDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['平均二乗誤差', SklearnRegressionMetricType.MeanSquaredError],
      ['R2スコア', SklearnRegressionMetricType.R2Score],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_regression_metric_dd', SklearnRegressionMetricDropdown);
