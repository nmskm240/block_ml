import * as Blockly from 'blockly/core';

import { SklearnClassificationModelType } from '../types';

export class SklearnClassificationModelDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['決定木', SklearnClassificationModelType.TreeClassifier],
      ['ロジスティック回帰', SklearnClassificationModelType.LogisticRegression],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_classification_model_dd', SklearnClassificationModelDropdown);
