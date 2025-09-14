import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnClassificationModelDropdown } from '../fields';
import { VariableTypes, SklearnClassificationModelType } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import logisticRegressionTemplate from './template/sklearn_select_classification_model/logistic_regression.py';
import treeClassifierTemplate from './template/sklearn_select_classification_model/tree_classifier.py';

export const SKLEARN_SELECT_CLASSIFICATION_MODEL =
  'sklearn_select_classification_model';

Blockly.Blocks[SKLEARN_SELECT_CLASSIFICATION_MODEL] = {
  init: function () {
    this.appendDummyInput()
      .appendField('分類モデルを作成')
      .appendField(new SklearnClassificationModelDropdown(), 'type');
    this.setOutput(true, VariableTypes.Model);
    this.setColour(100);
    this.setTooltip('指定した分類モデルを作成します');
  },
};

pythonGenerator.forBlock[SKLEARN_SELECT_CLASSIFICATION_MODEL] = (
  block,
  generator,
) => {
  const type = block.getFieldValue('type') as SklearnClassificationModelType;
  const template = match(type)
    .with(
      SklearnClassificationModelType.LogisticRegression,
      () => logisticRegressionTemplate,
    )
    .with(
      SklearnClassificationModelType.TreeClassifier,
      () => treeClassifierTemplate,
    )
    .exhaustive();
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {});
  return [code, Order.FUNCTION_CALL];
};
