import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';
import { match } from 'ts-pattern';

import { SklearnClassificationMetricDropdown } from '../fields';
import { VariableTypes, SklearnClassificationMetricType } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import accuracyScoreTemplate from './template/sklearn_get_classification_metric/accuracy_score.py';
import f1ScoreTemplate from './template/sklearn_get_classification_metric/f1_score.py';
import precisionScoreTemplate from './template/sklearn_get_classification_metric/precision_score.py';
import recallScoreTemplate from './template/sklearn_get_classification_metric/recall_score.py';

export const SKLEARN_GET_CLASSIFICATION_METRIC = 'sklearn_get_classification_metric';

Blockly.Blocks[SKLEARN_GET_CLASSIFICATION_METRIC] = {
  init: function () {
    this.appendValueInput('Y_TRUE')
      .setCheck(VariableTypes.Dataframe)
      .appendField('分類の正解データ');
    this.appendValueInput('Y_PRED')
      .setCheck(VariableTypes.Dataframe)
      .appendField('予測データ');
    this.appendDummyInput()
      .appendField('の')
      .appendField(new SklearnClassificationMetricDropdown(), 'METRIC')
      .appendField('を計算');
    this.setInputsInline(true);
    this.setOutput(true, VariableTypes.Number);
    this.setColour(350);
    this.setTooltip('正解データと予測データから指定された分類評価指標を計算します。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[SKLEARN_GET_CLASSIFICATION_METRIC] = (block, generator) => {
  const yTrue = generator.valueToCode(block, 'Y_TRUE', Order.ATOMIC) || 'None';
  const yPred = generator.valueToCode(block, 'Y_PRED', Order.ATOMIC) || 'None';
  const metricType = block.getFieldValue('METRIC') as SklearnClassificationMetricType;

  const template = match(metricType)
    .with(SklearnClassificationMetricType.Accuracy, () => accuracyScoreTemplate)
    .with(SklearnClassificationMetricType.Precision, () => precisionScoreTemplate)
    .with(SklearnClassificationMetricType.Recall, () => recallScoreTemplate)
    .with(SklearnClassificationMetricType.F1, () => f1ScoreTemplate)
    .exhaustive();

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_y_true__: yTrue,
    __BLOCKLY_y_pred__: yPred,
  });

  return [code, Order.FUNCTION_CALL];
};
