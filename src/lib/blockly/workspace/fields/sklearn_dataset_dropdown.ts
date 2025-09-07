import * as Blockly from 'blockly/core';

import { SklearnDatasets } from '../types';

export class SklearnDatasetDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['Iris', SklearnDatasets.Iris],
      ['Boston', SklearnDatasets.Boston],
      ['Digits', SklearnDatasets.Digits],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_dataset_dd', SklearnDatasetDropdown);
