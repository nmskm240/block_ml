import * as Blockly from 'blockly/core';

import { SklearnDatasets } from '../types';

export class SklearnDatasetDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['Diabetes', SklearnDatasets.Diabetes],
      ['Iris', SklearnDatasets.Iris],
      ['Linnerud', SklearnDatasets.Linnerud],
      ['Wine', SklearnDatasets.Wine],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_dataset_dd', SklearnDatasetDropdown);
