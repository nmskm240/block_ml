import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, stripImports } from '../utils';
import template from './template/dataframe_train_test_split.py';

export const DATAFRAME_TRAIN_TEST_SPLIT = 'dataframe_train_test_split';

Blockly.Blocks[DATAFRAME_TRAIN_TEST_SPLIT] = {
  init: function () {
    this.appendValueInput('X')
      .setCheck(VariableTypes.Dataframe)
      .appendField('特徴量 (X)');
    this.appendValueInput('Y')
      .setCheck(VariableTypes.Dataframe)
      .appendField('目的変数 (y)');
    this.appendDummyInput()
      .appendField('テストサイズ')
      .appendField(new Blockly.FieldNumber(0.2, 0, 1), 'TEST_SIZE');
    this.appendDummyInput()
      .appendField('乱数シード')
      .appendField(new Blockly.FieldNumber(42), 'RANDOM_STATE');
    this.appendDummyInput()
      .appendField('を学習データ')
      .appendField(new Blockly.FieldVariable('X_train'), 'X_TRAIN')
      .appendField(', テストデータ')
      .appendField(new Blockly.FieldVariable('X_test'), 'X_TEST')
      .appendField(', 学習ターゲット')
      .appendField(new Blockly.FieldVariable('y_train'), 'Y_TRAIN')
      .appendField(', テストターゲット')
      .appendField(new Blockly.FieldVariable('y_test'), 'Y_TEST')
      .appendField('に分割する');
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230); // Using a similar color to other DataFrame blocks
    this.setTooltip(
      '特徴量と目的変数を学習データとテストデータに分割し、指定された変数に代入します',
    );
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[DATAFRAME_TRAIN_TEST_SPLIT] = (block, generator) => {
  const x = generator.valueToCode(block, 'X', Order.NONE);
  const y = generator.valueToCode(block, 'Y', Order.NONE);
  const testSize = block.getFieldValue('TEST_SIZE');
  const randomState = block.getFieldValue('RANDOM_STATE');
  const xTrainVar = block.getField('X_TRAIN')?.getText() || 'X_train';
  const xTestVar = block.getField('X_TEST')?.getText() || 'X_test';
  const yTrainVar = block.getField('Y_TRAIN')?.getText() || 'y_train';
  const yTestVar = block.getField('Y_TEST')?.getText() || 'y_test';

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_X__: x,
    __BLOCKLY_Y__: y,
    __BLOCKLY_TEST_SIZE__: testSize,
    __BLOCKLY_RANDOM_STATE__: randomState,
    __BLOCKLY_X_TRAIN_VAR__: xTrainVar,
    __BLOCKLY_X_TEST_VAR__: xTestVar,
    __BLOCKLY_Y_TRAIN_VAR__: yTrainVar,
    __BLOCKLY_Y_TEST_VAR__: yTestVar,
  });

  return `${code}\n`;
};
