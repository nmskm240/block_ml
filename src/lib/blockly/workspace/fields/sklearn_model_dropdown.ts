import * as Blockly from 'blockly/core';

import { SklearnModelType } from '../types';

export class SklearnModelDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['決定木', SklearnModelType.TreeClassifier],
      ['ロジスティック回帰', SklearnModelType.LogisticRegression],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_model_dd', SklearnModelDropdown);
