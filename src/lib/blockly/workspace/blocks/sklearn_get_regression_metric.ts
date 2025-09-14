import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnRegressionMetricDropdown } from '../fields';
import { SklearnRegressionMetricType, VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import meanSquaredErrorTemplate from './template/sklearn_get_regression_metric/mean_squared_error.py';
import r2ScoreTemplate from './template/sklearn_get_regression_metric/r2_score.py';

export const SKLEARN_GET_REGRESSION_METRIC = 'sklearn_get_regression_metric';

Blockly.Blocks[SKLEARN_GET_REGRESSION_METRIC] = {
  init: function () {
    this.appendValueInput('Y_TRUE')
      .setCheck(VariableTypes.Dataframe)
      .appendField('回帰の正解データ');
    this.appendValueInput('Y_PRED')
      .setCheck(VariableTypes.Dataframe)
      .appendField('予測データ');
    this.appendDummyInput()
      .appendField('の')
      .appendField(new SklearnRegressionMetricDropdown(), 'METRIC')
      .appendField('を計算');
    this.setInputsInline(true);
    this.setOutput(true, VariableTypes.Number);
    this.setColour(350);
    this.setTooltip('正解データと予測データから指定された回帰評価指標を計算します。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_GET_REGRESSION_METRIC] = (block, generator) => {
  const yTrue = generator.valueToCode(block, 'Y_TRUE', Order.ATOMIC) || 'None';
  const yPred = generator.valueToCode(block, 'Y_PRED', Order.ATOMIC) || 'None';
  const metricType = block.getFieldValue('METRIC') as SklearnRegressionMetricType;

  const template = match(metricType)
    .with(SklearnRegressionMetricType.MeanSquaredError, () => meanSquaredErrorTemplate)
    .with(SklearnRegressionMetricType.R2Score, () => r2ScoreTemplate)
    .exhaustive();

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_y_true__: yTrue,
    __BLOCKLY_y_pred__: yPred,
  });

  return [code, Order.FUNCTION_CALL];
};
