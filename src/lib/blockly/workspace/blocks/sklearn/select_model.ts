/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../../../types/variables';

export const SK_LEARN_SELECT_MODEL = 'sklearn_select_model';

Blockly.Blocks[SK_LEARN_SELECT_MODEL] = {
  init: function () {
    this.appendDummyInput()
      .appendField('モデルを作成')
      .appendField(
        new Blockly.FieldDropdown([
          ['決定木', 'DecisionTreeClassifier'],
          ['ロジスティック回帰', 'LogisticRegression'],
        ]),
        'MODEL_TYPE'
      );
    this.setOutput(true, VariableTypes.Model);
    this.setColour(230);
    this.setTooltip('指定したモデルを作成します');
  },
};

pythonGenerator.forBlock[SK_LEARN_SELECT_MODEL] = (block, generator) => {
  const modelType = block.getFieldValue('MODEL_TYPE');
  (generator as any).definitions_['import_sklearn_tree'] =
    'from sklearn.tree import DecisionTreeClassifier';
  (generator as any).definitions_['import_sklearn_linear'] =
    'from sklearn.linear_model import LogisticRegression';
  return [`${modelType}()`, Order.ATOMIC];
};
