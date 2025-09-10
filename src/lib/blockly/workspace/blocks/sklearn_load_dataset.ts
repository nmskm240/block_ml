import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnDatasetDropdown } from '../fields';
import { SklearnDatasets, VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import irisTemplate from './template/sklearn_load_dataset/iris.py';
import wineTemplate from './template/sklearn_load_dataset/wine.py';

export const SKLEARN_LOAD_DATASET = 'sklearn_load_dataset';

Blockly.Blocks[SKLEARN_LOAD_DATASET] = {
  init: function () {
    this.appendDummyInput()
      .appendField('データセットをロード')
      .appendField(new SklearnDatasetDropdown(), 'dataset');
    this.setOutput(true, VariableTypes.Dataframe);
    this.setColour(180);
    this.setTooltip('scikit-learnのテストデータセットをロードします。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_LOAD_DATASET] = (block, generator) => {
  const dataset = block.getFieldValue('dataset') as SklearnDatasets;
  const template = match(dataset)
    .with(SklearnDatasets.Iris, () => irisTemplate)
    .with(SklearnDatasets.Wine, () => wineTemplate)
    .exhaustive();

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {});

  return [code, Order.FUNCTION_CALL];
};
