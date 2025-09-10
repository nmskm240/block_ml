import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnRegressionModelDropdown } from '../fields';
import { VariableTypes, SklearnRegressionModelType } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import linearRegressionTemplate from './template/sklearn_select_regression_model/linear_regression.py';
import svrTemplate from './template/sklearn_select_regression_model/svr.py';

export const SKLEARN_SELECT_REGRESSION_MODEL = 'sklearn_select_regression_model';

Blockly.Blocks[SKLEARN_SELECT_REGRESSION_MODEL] = {
  init: function () {
    this.appendDummyInput()
      .appendField('回帰モデルを作成')
      .appendField(new SklearnRegressionModelDropdown(), 'type');
    this.setOutput(true, VariableTypes.Model);
    this.setColour(100);
    this.setTooltip('指定した回帰モデルを作成します');
  },
};

pythonGenerator.forBlock[SKLEARN_SELECT_REGRESSION_MODEL] = (block, generator) => {
  const type = block.getFieldValue('type') as SklearnRegressionModelType;
  const template = match(type)
    .with(SklearnRegressionModelType.LinearRegression, () => linearRegressionTemplate)
    .with(SklearnRegressionModelType.SVR, () => svrTemplate)
    .exhaustive();
  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {});
  return [code, Order.FUNCTION_CALL];
};
