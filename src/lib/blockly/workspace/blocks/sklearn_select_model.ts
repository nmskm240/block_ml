import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnModelDropdown } from '../fields';
import { VariableTypes, SklearnModelType } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import logisticRegressionTemplate from './template/sklearn_select_model/logistic_regression.py';
import treeClassifierTemplate from './template/sklearn_select_model/tree_classifier.py';

export const SKLEARN_SELECT_MODEL = 'sklearn_select_model';

Blockly.Blocks[SKLEARN_SELECT_MODEL] = {
  init: function () {
    this.appendDummyInput()
      .appendField('モデルを作成')
      .appendField(new SklearnModelDropdown(), 'type');
    this.setOutput(true, VariableTypes.Model);
    this.setColour(230);
    this.setTooltip('指定したモデルを作成します');
  },
};

pythonGenerator.forBlock[SKLEARN_SELECT_MODEL] = (block, generator) => {
  const type = block.getFieldValue('type') as SklearnModelType;
  const template = match(type)
    .with(SklearnModelType.LogisticRegression, () => logisticRegressionTemplate)
    .with(SklearnModelType.TreeClassifier, () => treeClassifierTemplate)
    .exhaustive();
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {});
  return [code, Order.FUNCTION_CALL];
};
