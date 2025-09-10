import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnRegressionMetricDropdown } from '../fields';
import { VariableTypes, SklearnRegressionMetricType } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import getMetricTemplate from './template/sklearn_get_regression_metric/get_metric.py';

export const SKLEARN_GET_REGRESSION_METRIC = 'sklearn_get_regression_metric';

Blockly.Blocks[SKLEARN_GET_REGRESSION_METRIC] = {
  init: function () {
    this.appendValueInput('Y_TRUE')
      .setCheck(VariableTypes.Dataframe)
      .appendField('正解データ');
    this.appendValueInput('Y_PRED')
      .setCheck(VariableTypes.Dataframe)
      .appendField('予測データ');
    this.appendDummyInput()
      .appendField('の')
      .appendField(new SklearnRegressionMetricDropdown(), 'METRIC')
      .appendField('を計算');
    this.setInputsInline(true);
    this.setOutput(true, VariableTypes.Number);
    this.setColour(230);
    this.setTooltip('正解データと予測データから指定された回帰評価指標を計算します。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_GET_REGRESSION_METRIC] = (block, generator) => {
  const yTrue = generator.valueToCode(block, 'Y_TRUE', Order.ATOMIC) || 'None';
  const yPred = generator.valueToCode(block, 'Y_PRED', Order.ATOMIC) || 'None';
  const metricType = block.getFieldValue('METRIC') as SklearnRegressionMetricType;

  const body = stripImports(getMetricTemplate, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_y_true__: yTrue,
    __BLOCKLY_y_pred__: yPred,
    __BLOCKLY_metric_function__: metricType,
  });

  return [code, Order.FUNCTION_CALL];
};
