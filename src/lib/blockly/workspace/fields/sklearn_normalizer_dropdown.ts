import * as Blockly from 'blockly/core';

import { SklearnNormalizerType } from '../types';

export class SklearnNormalizerDropdown extends Blockly.FieldDropdown {
  constructor() {
    super([
      ['L2正規化', SklearnNormalizerType.L2],
      ['L1正規化', SklearnNormalizerType.L1],
    ]);
  }
}

Blockly.fieldRegistry.register('sklearn_normalizer_dd', SklearnNormalizerDropdown);
