import * as Blockly from 'blockly/core';

import { SklearnClassificationMetricType } from '../types';

export class SklearnClassificationMetricDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['正解率', SklearnClassificationMetricType.Accuracy],
      ['適合率', SklearnClassificationMetricType.Precision],
      ['再現率', SklearnClassificationMetricType.Recall],
      ['F1スコア', SklearnClassificationMetricType.F1],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_classification_metric_dd', SklearnClassificationMetricDropdown);
