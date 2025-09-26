import * as Blockly from 'blockly/core';
import { Order, pythonGenerator } from 'blockly/python';

import { VariableTypes } from '../types';
import { applyPlaceholders, createShadowBlock, stripImports } from '../utils';
import template from './template/dataframe_isnull.py';

export const DATAFRAME_ISNULL = 'dataframe_isnull';

Blockly.Blocks[DATAFRAME_ISNULL] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('df')
      .appendField('DataFrame')
      .setCheck(VariableTypes.Dataframe)
      .setShadowDom(createShadowBlock('variables_get', { VAR: 'df' }));
    this.appendDummyInput().appendField('の欠損値を確認');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip('DataFrameの各列に含まれる欠損値の数を出力します。');
    this.setHelpUrl('');
  },
};

pythonGenerator.forBlock[DATAFRAME_ISNULL] = (block, generator) => {
  const df = generator.valueToCode(block, 'df', Order.NONE) || 'df';

  const body = stripImports(template, generator);
  const code = applyPlaceholders(body, {
    __BLOCKLY_df__: df,
  });

  return code;
};
