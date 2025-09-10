import * as Blockly from 'blockly/core';

import { SklearnDiscretizerType } from '../types';

export class SklearnDiscretizerDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['2値化', SklearnDiscretizerType.Binarizer],
      ['ビン分割', SklearnDiscretizerType.KBinsDiscretizer],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_discretizer_dd', SklearnDiscretizerDropdown);
